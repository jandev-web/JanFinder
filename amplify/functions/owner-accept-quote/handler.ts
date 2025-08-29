import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { randomUUID } from 'node:crypto';

const ddb = new DynamoDBClient({});
const lambda = new LambdaClient({});

const TABLE = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';
const GET_QUOTE_PDF_FUNCTION_NAME = process.env.GET_QUOTE_PDF_FUNCTION_NAME || 'get-quote-pdf';
const SEND_QUOTE_EMAIL_FUNCTION_NAME = process.env.SEND_QUOTE_EMAIL_FUNCTION_NAME || 'send-quote-acceptance-email';

type AppSyncEvent = { arguments?: { quoteID?: string; franchiseID?: string; ownerID?: string } };

export const handler = async (event: AppSyncEvent, context?: any) => {
  const requestId = context?.awsRequestId || randomUUID();
  const now = new Date().toISOString();

  console.log(`[owner-accept-quote][${requestId}] START`, {
    env: {
      TABLE,
      GET_QUOTE_PDF_FUNCTION_NAME,
      SEND_QUOTE_EMAIL_FUNCTION_NAME,
    },
    eventArgs: event?.arguments ?? null,
  });

  try {
    const { quoteID, franchiseID, ownerID } = event?.arguments ?? {};
    if (!quoteID || !franchiseID || !ownerID) {
      console.warn(`[owner-accept-quote][${requestId}] Missing required args`);
      return { statusCode: 400, message: 'Missing quoteID, franchiseID, or ownerID', requestId };
    }

    // 1) Get quote
    console.log(`[owner-accept-quote][${requestId}] DDB GetItem`, { quoteID, table: TABLE });
    const getRes = await ddb.send(
      new GetItemCommand({ TableName: TABLE, Key: { QuoteID: { S: quoteID } } })
    );
    console.log(`[owner-accept-quote][${requestId}] DDB GetItem response`, {
      hasItem: !!getRes.Item,
      consumed: getRes.ConsumedCapacity,
    });

    const item = getRes.Item;
    if (!item) {
      console.warn(`[owner-accept-quote][${requestId}] Quote not found`);
      return { statusCode: 404, message: 'Quote not found', requestId };
    }

    const franchise = item.Franchise?.S;
    const owner = item.OwnerID?.S;
    console.log(`[owner-accept-quote][${requestId}] Current fields`, { franchise, owner });

    if (franchise !== 'None' || owner !== 'None') {
      console.warn(`[owner-accept-quote][${requestId}] Quote already taken`);
      return { statusCode: 400, message: 'Sorry, this quote has been taken', requestId };
    }

    // 2) Update item
    console.log(`[owner-accept-quote][${requestId}] DDB UpdateItem`, {
      quoteID, franchiseID, ownerID, ts: now,
    });
    const updRes = await ddb.send(
      new UpdateItemCommand({
        TableName: TABLE,
        Key: { QuoteID: { S: quoteID } },
        UpdateExpression:
          'SET Franchise = :f, OwnerID = :o, AcceptedTimestamp = :ts, isAvailable = :ia, IsAccepted = :acc',
        ExpressionAttributeValues: {
          ':f': { S: franchiseID },
          ':o': { S: ownerID },
          ':ts': { S: now },
          ':ia': { S: 'False' },
          ':acc': { S: 'True' },
        },
        ReturnValues: 'NONE',
      })
    );
    console.log(`[owner-accept-quote][${requestId}] DDB UpdateItem response`, {
      $metadata: updRes.$metadata,
    });

    // 3) Sync invoke: get-quote-pdf
    try {
      const payloadObj = { body: { quoteID }, requestId };
      const payload = new TextEncoder().encode(JSON.stringify(payloadObj));
      console.log(`[owner-accept-quote][${requestId}] Invoking ${GET_QUOTE_PDF_FUNCTION_NAME} (sync)`, payloadObj);

      const resp = await lambda.send(
        new InvokeCommand({
          FunctionName: GET_QUOTE_PDF_FUNCTION_NAME,
          InvocationType: 'Event',
          Payload: payload,
        })
      );

      const status = resp.StatusCode;
      const fnError = resp.FunctionError;
      const raw = resp.Payload ? new TextDecoder().decode(resp.Payload) : '';
      let parsed: any = null;
      try { parsed = raw ? JSON.parse(raw) : null; } catch (e) {}

      console.log(`[owner-accept-quote][${requestId}] ${GET_QUOTE_PDF_FUNCTION_NAME} response`, {
        status, fnError, parsed,
      });

      if (fnError || (parsed && parsed.statusCode && parsed.statusCode >= 400)) {
        console.error(`[owner-accept-quote][${requestId}] ${GET_QUOTE_PDF_FUNCTION_NAME} reported error`, {
          status, fnError, parsed,
        });
        // Continue; email may still be useful even if PDF failed.
      }
    } catch (e) {
      console.error(`[owner-accept-quote][${requestId}] ${GET_QUOTE_PDF_FUNCTION_NAME} invoke failed`, e);
      // continue
    }

    // 4) Async invoke: send-quote-acceptance-email
    try {
      const payloadObj = { body: { quoteID }, requestId };
      const payload = new TextEncoder().encode(JSON.stringify(payloadObj));
      console.log(`[owner-accept-quote][${requestId}] Invoking ${SEND_QUOTE_EMAIL_FUNCTION_NAME} (async)`, payloadObj);

      const resp = await lambda.send(
        new InvokeCommand({
          FunctionName: SEND_QUOTE_EMAIL_FUNCTION_NAME,
          InvocationType: 'Event',
          Payload: payload,
        })
      );

      console.log(`[owner-accept-quote][${requestId}] ${SEND_QUOTE_EMAIL_FUNCTION_NAME} invoke ack`, {
        status: resp.StatusCode,
      });
    } catch (e) {
      console.error(`[owner-accept-quote][${requestId}] ${SEND_QUOTE_EMAIL_FUNCTION_NAME} invoke failed`, e);
    }

    console.log(`[owner-accept-quote][${requestId}] DONE`);
    return { statusCode: 200, message: 'Franchise ID and CBO ID updated successfully', requestId };
  } catch (err) {
    console.error(`[owner-accept-quote][${requestId}] FATAL`, err);
    return { statusCode: 500, message: 'Internal Server Error', requestId, error: String(err) };
  }
};

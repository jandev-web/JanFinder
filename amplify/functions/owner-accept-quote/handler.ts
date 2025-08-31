//owner-accept-quote handler.ts
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { randomUUID } from 'node:crypto';

const ddb = new DynamoDBClient({});
const sfn = new SFNClient({});

const TABLE = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';
const DOC_PIPELINE_ARN = process.env.DOC_PIPELINE_ARN || '';
const DEFAULT_TIMEZONE = process.env.DEFAULT_TIMEZONE || 'America/Chicago';

type AppSyncEvent = { arguments?: { quoteID?: string; franchiseID?: string; ownerID?: string } };

export const handler = async (event: AppSyncEvent, context?: any) => {
  const requestId = context?.awsRequestId || randomUUID();
  const now = new Date().toISOString();

  console.log(`[owner-accept-quote][${requestId}] START`, {
    env: { TABLE, DOC_PIPELINE_ARN, DEFAULT_TIMEZONE },
    eventArgs: event?.arguments ?? null,
  });

  try {
    const { quoteID, franchiseID, ownerID } = event?.arguments ?? {};
    if (!quoteID || !franchiseID || !ownerID) {
      return { statusCode: 400, message: 'Missing quoteID, franchiseID, or ownerID', requestId };
    }

    const getRes = await ddb.send(new GetItemCommand({ TableName: TABLE, Key: { QuoteID: { S: quoteID } } }));
    if (!getRes.Item) return { statusCode: 404, message: 'Quote not found', requestId };

    const franchise = getRes.Item.Franchise?.S;
    const owner = getRes.Item.OwnerID?.S;
    if (franchise !== 'None' || owner !== 'None') {
      return { statusCode: 400, message: 'Sorry, this quote has been taken', requestId };
    }

    await ddb.send(new UpdateItemCommand({
      TableName: TABLE,
      Key: { QuoteID: { S: quoteID } },
      UpdateExpression: 'SET Franchise = :f, OwnerID = :o, AcceptedTimestamp = :ts, isAvailable = :ia, IsAccepted = :acc',
      ExpressionAttributeValues: {
        ':f': { S: franchiseID },
        ':o': { S: ownerID },
        ':ts': { S: now },
        ':ia': { S: 'False' },
        ':acc': { S: 'True' },
      },
      ReturnValues: 'NONE',
    }));

    // Kick off the document pipeline
    if (!DOC_PIPELINE_ARN) {
      console.warn(`[owner-accept-quote][${requestId}] DOC_PIPELINE_ARN not set; skipping pipeline`);
    } else {
      const input = { quoteID, timezone: DEFAULT_TIMEZONE, requestId };
      const resp = await sfn.send(new StartExecutionCommand({
        stateMachineArn: DOC_PIPELINE_ARN,
        input: JSON.stringify(input),
      }));
      console.log(`[owner-accept-quote][${requestId}] Started pipeline`, { executionArn: resp.executionArn });
    }

    return { statusCode: 200, message: 'Franchise ID and CBO ID updated successfully', requestId };
  } catch (err) {
    console.error(`[owner-accept-quote][${requestId}] FATAL`, err);
    return { statusCode: 500, message: 'Internal Server Error', requestId, error: String(err) };
  }
};

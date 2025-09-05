import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  BatchGetCommand,
} from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

// Tables / index
const SELL_REQUEST_TABLE = 'SellRequest_DB';
const CUSTOMER_QUOTES_TABLE = 'CustomerQuotes';
const TARGET_USER_INDEX = 'TargetUser-index';

type HandlerEvent = {
  arguments?: {
    memberID?: string; // CBOID / TargetUser
    limit?: number;
  };
};

export const handler = async (event: HandlerEvent) => {
  const memberID = event?.arguments?.memberID?.trim();
  if (!memberID) {
    throw new Error('memberID is required');
  }

  // 1) Query SellRequest_DB by TargetUser-index where Status = PENDING
  const reqItems: any[] = [];
  let lastKey: Record<string, any> | undefined = undefined;

  do {
    const q: any = await ddb.send(new QueryCommand({
      TableName: SELL_REQUEST_TABLE,
      IndexName: TARGET_USER_INDEX,
      KeyConditionExpression: '#tu = :tu',
      FilterExpression: '#st = :pending',
      ExpressionAttributeNames: {
        '#tu': 'TargetUser',
        '#st': 'Status',
      },
      ExpressionAttributeValues: {
        ':tu': memberID,
        ':pending': 'PENDING',
      },
      ExclusiveStartKey: lastKey,
    }));
    reqItems.push(...(q.Items ?? []));
    lastKey = q.LastEvaluatedKey;
  } while (lastKey);

  if (!reqItems.length) {
    return { quotes: [], count: 0 };
  }

  // Map QuoteID -> sellRequestID (first match wins if multiple)
  const quoteIdToReqId = new Map<string, string>();
  for (const r of reqItems) {
    const quoteId: string | undefined =
      r.QuoteID ?? r.quoteID ?? r.QuoteId ?? r.quoteId;
    const requestId: string | undefined =
      r.RequestID ?? r.requestID ?? r.SellRequestID ?? r.id;
    if (quoteId && requestId && !quoteIdToReqId.has(quoteId)) {
      quoteIdToReqId.set(quoteId, requestId);
    }
  }

  // 2) BatchGet the quotes by QuoteID
  const quoteIDs = Array.from(quoteIdToReqId.keys());
  const allQuotes: any[] = [];
  const chunkSize = 100;
  for (let i = 0; i < quoteIDs.length; i += chunkSize) {
    const chunk = quoteIDs.slice(i, i + chunkSize);
    const res = await ddb.send(new BatchGetCommand({
      RequestItems: {
        [CUSTOMER_QUOTES_TABLE]: {
          Keys: chunk.map(id => ({ QuoteID: id })),
        },
      },
    }));
    const got = res.Responses?.[CUSTOMER_QUOTES_TABLE] ?? [];
    allQuotes.push(...got);
    // If needed, handle res.UnprocessedKeys here.
  }

  // 3) Attach sellRequestID to each quote result
  const quotesWithRequestId = allQuotes.map(q => {
    const qid: string | undefined =
      q.QuoteID ?? q.quoteID ?? q.id ?? q.QuoteId ?? q.quoteId;
    return {
      ...q,
      sellRequestID: qid ? quoteIdToReqId.get(qid) : undefined,
    };
  });

  return {
    quotes: quotesWithRequestId,
    count: quotesWithRequestId.length,
  };
};

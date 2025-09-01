// amplify/functions/get-quotes-owner-accepted/handler.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// ---- Environment (set in resource.ts) ----
const QUOTES_TABLE_NAME       = process.env.QUOTES_TABLE_NAME       ?? 'CustomerQuotes';
const FRANCHISE_INDEX_NAME    = process.env.FRANCHISE_INDEX_NAME    ?? 'franchiseIndex';
const OWNER_INDEX_NAME        = process.env.OWNER_INDEX_NAME        ?? 'ownerIndex';
const SELL_REQUEST_TABLE_NAME = process.env.SELL_REQUEST_TABLE_NAME ?? 'SellRequest_DB';
const SELL_REQUEST_QUOTE_GSI  = process.env.SELL_REQUEST_QUOTE_GSI  ?? 'QuoteID-index';

// Small helper to page through a full GSI
async function* queryAll(params: Omit<QueryCommand['input'], 'ExclusiveStartKey'>) {
  let ExclusiveStartKey: Record<string, any> | undefined;
  do {
    const page = await ddb.send(new QueryCommand({ ...params, ExclusiveStartKey }));
    yield page.Items ?? [];
    ExclusiveStartKey = page.LastEvaluatedKey;
  } while (ExclusiveStartKey);
}

export const handler: Schema['getAcceptedQuotesOwner']['functionHandler'] = async ({ arguments: args }) => {
  const franchiseID = (args as any)?.franchiseID as string | undefined;
  const ownerID     = (args as any)?.ownerID     as string | undefined;

  if (!franchiseID) throw new Error('Missing required argument: franchiseID');
  if (!ownerID)     throw new Error('Missing required argument: ownerID');

  // 1) Pull all quotes for the franchise (via franchiseIndex)
  const franchItems: any[] = [];
  for await (const items of queryAll({
    TableName: QUOTES_TABLE_NAME,
    IndexName: FRANCHISE_INDEX_NAME,
    KeyConditionExpression: 'Franchise = :fr',
    ExpressionAttributeValues: { ':fr': franchiseID },
  })) {
    franchItems.push(...items);
  }

  // 2) Pull all quotes for the owner (via ownerIndex)
  const ownerItems: any[] = [];
  for await (const items of queryAll({
    TableName: QUOTES_TABLE_NAME,
    IndexName: OWNER_INDEX_NAME,
    KeyConditionExpression: 'OwnerID = :own',
    ExpressionAttributeValues: { ':own': ownerID },
  })) {
    ownerItems.push(...items);
  }

  // 3) Intersect by QuoteID (normalize a bit just in case)
  const qidOf = (x: any) => x?.QuoteID ?? x?.quoteID ?? x?.id;
  const ownerSet = new Set(ownerItems.map(qidOf).filter(Boolean));

  const intersection = franchItems.filter((q) => {
    const qid = qidOf(q);
    return qid && ownerSet.has(qid);
  });

  // For quick lookup by QuoteID (use franchise version arbitrarily)
  const franchMap = new Map(intersection.map((q) => [qidOf(q), q]));

  // 4) For each quote in the intersection, attach SellRequest_DB records (by QuoteID-index)
  const results = await Promise.all(
    Array.from(franchMap.keys()).map(async (quoteID) => {
      const reqResp = await ddb.send(new QueryCommand({
        TableName: SELL_REQUEST_TABLE_NAME,
        IndexName: SELL_REQUEST_QUOTE_GSI,
        KeyConditionExpression: 'QuoteID = :qid',
        ExpressionAttributeValues: { ':qid': quoteID },
      }));

      return {
        quoteDetails: franchMap.get(quoteID),
        requestDetails: reqResp.Items ?? [],
      };
    })
  );

  return results;
};

export default handler;

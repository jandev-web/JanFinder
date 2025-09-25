// amplify/functions/get-quotes-owner-accepted/handler.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// ---- Environment (set in resource.ts) ----
const QUOTES_TABLE_NAME       = process.env.QUOTES_TABLE_NAME       ?? 'CustomerQuotes';
const FRANCHISE_INDEX_NAME    = process.env.FRANCHISE_INDEX_NAME    ?? 'franchiseIndex';
const SELL_REQUEST_TABLE_NAME = process.env.SELL_REQUEST_TABLE_NAME ?? 'SellRequest_DB';
const SELL_REQUEST_QUOTE_GSI  = process.env.SELL_REQUEST_QUOTE_GSI  ?? 'QuoteID-index';

// ---- Helpers ----

// Page through a full Query (GSI or main)
async function* queryAll(params: Omit<QueryCommand['input'], 'ExclusiveStartKey'>) {
  let ExclusiveStartKey: Record<string, any> | undefined;
  do {
    const page = await ddb.send(new QueryCommand({ ...params, ExclusiveStartKey }));
    yield page.Items ?? [];
    ExclusiveStartKey = page.LastEvaluatedKey;
  } while (ExclusiveStartKey);
}

// Pull a best-effort QuoteID from an item
const getQuoteID = (x: any) => x?.QuoteID ?? x?.quoteID ?? x?.id;


export const handler: Schema['getAcceptedQuotesOwner']['functionHandler'] = async ({ arguments: args }) => {
  const franchiseID = (args as any)?.franchiseID as string | undefined;
  const ownerID     = (args as any)?.ownerID     as string | undefined;

  if (!franchiseID) throw new Error('Missing required argument: franchiseID');
  if (!ownerID)     throw new Error('Missing required argument: ownerID');

  // 1) Pull all quotes for the franchise (via franchiseIndex)
  const franchiseQuotesAll: any[] = [];
  for await (const items of queryAll({
    TableName: QUOTES_TABLE_NAME,
    IndexName: FRANCHISE_INDEX_NAME,
    KeyConditionExpression: 'franchiseID = :fr',
    ExpressionAttributeValues: { ':fr': franchiseID },
  })) {
    franchiseQuotesAll.push(...items);
  }

  // 2) Partition into ownerQuotes (same owner) vs franchiseQuotes (different owner)
  const ownerQuotesRaw = franchiseQuotesAll.filter(
    (q) => (q?.OwnerID ?? q?.ownerID) === ownerID
  );

  const franchiseQuotesRaw = franchiseQuotesAll.filter(
    (q) => (q?.OwnerID ?? q?.ownerID) !== ownerID
  );

  // 3) For each quote, fetch its SellRequest_DB records by QuoteID and build the required shape.
  async function enrich(quotes: any[]) {
    return Promise.all(
      quotes.map(async (q) => {
        const quoteID = getQuoteID(q);
        const reqResp = quoteID
          ? await ddb.send(new QueryCommand({
              TableName: SELL_REQUEST_TABLE_NAME,
              IndexName: SELL_REQUEST_QUOTE_GSI,
              KeyConditionExpression: 'QuoteID = :qid',
              ExpressionAttributeValues: { ':qid': quoteID },
            }))
          : { Items: [] as any[] };

        // Normalize keys so only "QuoteID" remains capitalized inside both blocks
        const quoteDetails      = q;
        const requestDetailsArr = reqResp.Items ?? [];

        return {
          quoteDetails,
          requestDetails: requestDetailsArr,
        };
      })
    );
  }

  const [ownerQuotes, franchiseQuotes] = await Promise.all([
    enrich(ownerQuotesRaw),
    enrich(franchiseQuotesRaw),
  ]);

  // 4) Return in requested shape
  return {
    franchiseQuotes,
    ownerQuotes,
  };
};

export default handler;

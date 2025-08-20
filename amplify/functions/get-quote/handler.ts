// functions/get-quote/handler.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient());
const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

// optional: normalize DB item → API shape (camelCase id)
function mapDbItem(item: any) {
  if (!item) return null;
  const { QuoteID, ...rest } = item;
  return { quoteID: QuoteID ?? rest?.quoteID, ...rest };
}

// ✅ Amplify Data / AppSync resolver handler only
export const handler: Schema['getQuote']['functionHandler'] = async (event) => {
  const quoteID = event.arguments?.quoteID;
  if (!quoteID) {
    // For GraphQL, throw to surface as an error instead of data payload
    throw new Error('quoteID is required');
  }

  const resp = await ddbDoc.send(
    new GetCommand({ TableName: QUOTES, Key: { QuoteID: String(quoteID) } })
  );

  if (!resp.Item) {
    // Not found: return a benign payload; client can check quote === null
    return { message: 'Quote not found', quote: null };
  }

  const quote = mapDbItem(resp.Item);
  return { message: 'OK', quote };
};

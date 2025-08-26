// amplify/functions/get-quotes-owner-available/handler.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient());

// ✅ Use env injected by the function's resource.ts
const TABLE   = process.env.QUOTES_TABLE_NAME ?? "CustomerQuotes";
const INDEX   = process.env.AVAILABLE_QUOTES_INDEX ?? 'AvailableQuotesIndex';
const PK_NAME = process.env.AVAILABLE_PK_ATTR    ?? 'isAvailable';

// Allow using a boolean or string per your GSI attribute type
const RAW_VAL = process.env.AVAILABLE_PK_VALUE ?? 'True';
const PK_VALUE: string | boolean =
  RAW_VAL === 'true' ? true : RAW_VAL === 'false' ? false : RAW_VAL;

export const handler: Schema['getAvailableQuotesOwner']['functionHandler'] = async () => {
  const resp = await ddb.send(new QueryCommand({
    TableName: TABLE,
    IndexName: INDEX,
    KeyConditionExpression: `${PK_NAME} = :v`,
    ExpressionAttributeValues: { ':v': PK_VALUE },
  }));

  // Return the array directly (no envelope)
  return resp.Items ?? [];
};

export default handler;


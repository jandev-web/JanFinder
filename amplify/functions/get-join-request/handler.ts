// amplify/functions/get-join-request/handler.ts
import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const JOIN_TABLE = process.env.JOIN_TABLE || 'JoinRequest_DB';

export const handler: Handler = async (event) => {
  const args = event?.arguments ?? {};
  const requestId = args.requestId as string;

  if (!requestId) {
    return { statusCode: 400, body: JSON.stringify({ ok:false, message:'Missing requestId' }) };
  }

  const { Item } = await ddb.send(new GetCommand({
    TableName: JOIN_TABLE,
    Key: { RequestID: requestId },
  }));

  if (!Item) return { statusCode: 200, body: JSON.stringify(null) };

  // Return limited subset to render the page
  const nowIso = new Date().toISOString();
  const status = Item.Status;
  const resp = {
    email: Item.Email,
    franchiseID: Item.FranchiseID,
    status: status,
    expiresOn: Item.ExpiresOn,
    expired: Item.ExpiresOn && Item.ExpiresOn < nowIso,
  };

  return { statusCode: 200, body: JSON.stringify(resp) };
};

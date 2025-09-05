import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), { marshallOptions: { removeUndefinedValues: true } });

export const handler = async (event: any) => {
  const { quoteID, requestID, bucket, pdf_key } = event || {};
  if (!quoteID || !requestID || !bucket || !pdf_key) throw new Error('Missing inputs');

  const SELL_REQUEST_TABLE = process.env.SELL_REQUEST_TABLE!;
  const CUSTOMER_QUOTES_TABLE = process.env.CUSTOMER_QUOTES_TABLE!;
  const now = new Date().toISOString();

  await ddb.send(new UpdateCommand({
    TableName: SELL_REQUEST_TABLE,
    Key: { RequestID: requestID },
    UpdateExpression: 'SET #s = :s, ContractPdfKey = :k, UpdatedAt = :u',
    ExpressionAttributeNames: { '#s': 'Status' },
    ExpressionAttributeValues: { ':s': 'ACCEPTED', ':k': pdf_key, ':u': now },
  }));

  await ddb.send(new UpdateCommand({
    TableName: CUSTOMER_QUOTES_TABLE,
    Key: { QuoteID: quoteID },
    UpdateExpression: 'SET ContractPdfBucket = :b, ContractPdfKey = :k, UpdatedAt = :u',
    ExpressionAttributeValues: { ':b': bucket, ':k': pdf_key, ':u': now },
  }));

  return { ok: true };
};

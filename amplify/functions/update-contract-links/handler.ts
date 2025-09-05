import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

// Tables from env
const CUSTOMER_QUOTES_TABLE = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';
const SELL_REQUEST_TABLE    = process.env.SELL_REQUEST_TABLE    || 'SellRequest_DB';

type Event = {
  quoteID?: string;
  requestID?: string;   // sell request ID in SellRequest_DB
  newOwnerID?: string;  // CBOID to become the new OwnerID on the quote
};

export const handler = async (event: Event) => {
  const { quoteID, requestID, newOwnerID } = event || {};
  if (!quoteID)   throw new Error('quoteID is required');
  if (!requestID) throw new Error('requestID is required');
  if (!newOwnerID) throw new Error('newOwnerID is required');

  const nowIso = new Date().toISOString();

  // 1) Update the Quote (CustomerQuotes)
  //    - ContractPDF = true
  //    - isSold = true
  //    - soldAt = now
  //    - OwnerID = newOwnerID (CBOID)
  //    DO NOT set ContractPdfBucket / ContractPdfKey (and optionally remove them if they exist)
  const updateQuote = new UpdateCommand({
    TableName: CUSTOMER_QUOTES_TABLE,
    Key: { QuoteID: quoteID },
    UpdateExpression:
      'SET ContractPDF = :true, isSold = :true, soldAt = :now, OwnerID = :owner ' +
      'REMOVE ContractPdfBucket, ContractPdfKey',
    ExpressionAttributeValues: {
      ':true': true,
      ':now': nowIso,
      ':owner': newOwnerID,
    },
    ReturnValues: 'NONE',
  });

  // 2) Update SellRequest_DB
  //    - Status = ACCEPTED
  //    - UpdatedAt = now
  const updateRequest = new UpdateCommand({
    TableName: SELL_REQUEST_TABLE,
    Key: { RequestID: requestID },
    UpdateExpression: 'SET #st = :accepted, UpdatedAt = :now',
    ExpressionAttributeNames: { '#st': 'Status' },
    ExpressionAttributeValues: {
      ':accepted': 'ACCEPTED',
      ':now': nowIso,
    },
    ReturnValues: 'NONE',
  });

  await ddb.send(updateQuote);
  await ddb.send(updateRequest);

  return { ok: true, updatedAt: nowIso };
};

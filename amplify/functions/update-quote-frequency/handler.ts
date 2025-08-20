import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

export const handler: Schema['updateQuoteFrequency']['functionHandler'] = async (event) => {
  const quoteID = event.arguments?.quoteID as string | undefined;
  const frequency = event.arguments?.frequency as string | undefined;

  if (!quoteID) throw new Error('quoteID is required');
  if (!frequency) throw new Error('frequency is required');

  await ddbDoc.send(new UpdateCommand({
    TableName: QUOTES,
    Key: { QuoteID: String(quoteID) },
    UpdateExpression: 'SET quoteInfo.frequency = :f',
    ExpressionAttributeValues: { ':f': frequency },
    // fail if item missing; avoids a GetItem pre-check
    ConditionExpression: 'attribute_exists(QuoteID)',
    ReturnValues: 'NONE',
  }));

  return { message: 'OK' };
};

// amplify/functions/update-quote-frequency/handler.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

// ✅ Amplify Data ONLY
export const handler: Schema['updateQuoteFrequency']['functionHandler'] = async (event) => {
  const quoteID = event.arguments?.quoteID as string | undefined;
  const freqArg = event.arguments?.frequency as unknown;

  if (!quoteID) throw new Error('quoteID is required');

  // Allow empty string '' to CLEAR the frequency, but disallow non-strings
  if (typeof freqArg !== 'string') {
    throw new Error('frequency must be a string');
  }
  const frequency = freqArg; // may be '' to reset

  await ddbDoc.send(
    new UpdateCommand({
      TableName: QUOTES,
      Key: { QuoteID: String(quoteID) }, // PK name as defined in DDB
      UpdateExpression: 'SET quoteInfo.#freq = :f',
      ExpressionAttributeNames: { '#freq': 'frequency' },
      ExpressionAttributeValues: { ':f': frequency },
      // 404-like behavior if the item doesn't exist
      ConditionExpression: 'attribute_exists(QuoteID)',
      ReturnValues: 'NONE',
    })
  );

  return { message: 'OK' };
};

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

// ✅ Amplify Data ONLY — no event.body, no REST response
export const handler: Schema['confirmQuote']['functionHandler'] = async (event) => {
  const quoteID = event.arguments?.quoteID as string | undefined;
  if (!quoteID) throw new Error('quoteID is required');

  // 1) Get the quote
  const got = await ddbDoc.send(
    new GetCommand({ TableName: QUOTES, Key: { QuoteID: String(quoteID) } })
  );
  if (!got.Item) throw new Error(`Quote ${quoteID} not found`);

  // Idempotency: reuse existing ConfirmationNumber if already confirmed
  let confirmationNumber = got.Item.ConfirmationNumber as string | undefined;
  const alreadyConfirmed = Boolean(got.Item.Confirmed);

  if (!alreadyConfirmed || !confirmationNumber) {
    confirmationNumber = Math.random().toString(36).slice(2, 10).toUpperCase();
    const timestamp = new Date().toISOString();

    await ddbDoc.send(new UpdateCommand({
      TableName: QUOTES,
      Key: { QuoteID: String(quoteID) },
      UpdateExpression:
        'SET confirmed = :c, confirmationNumber = :n, isAvailable = :a, confirmationTimestamp = :t',
      ExpressionAttributeValues: {
        ':c': 'True',
        ':n': confirmationNumber,
        ':a': 'True', // keep your original string value
        ':t': timestamp,
      },
      ReturnValues: 'NONE',
    }));
  }

  return {
    message: `Quote ${quoteID} has been confirmed`,
    confirmationNumber,
  };
};

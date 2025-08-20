import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

export const handler: Schema['updateQuoteBudget']['functionHandler'] = async (event) => {
  const quoteID = event.arguments?.quoteID as string | undefined;
  const rawBudget = event.arguments?.budget as number | string | undefined;

  const budget = typeof rawBudget === 'string' ? Number(rawBudget) : rawBudget;

  if (!quoteID) throw new Error('quoteID is required');
  if (budget === undefined || budget === null || !Number.isFinite(Number(budget))) {
    throw new Error('budget must be a number');
  }

  await ddbDoc.send(
    new UpdateCommand({
      TableName: QUOTES,
      Key: { QuoteID: String(quoteID) },
      UpdateExpression: 'SET quoteInfo.budget = :b',
      ExpressionAttributeValues: { ':b': Number(budget) },
      ReturnValues: 'NONE',
    })
  );

  return { message: 'OK' };
};

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

// Amplify Data ONLY handler
export const handler: Schema['updatePackageChoice']['functionHandler'] = async (event) => {
  const quoteID = event.arguments?.quoteID as string | undefined;

  // AWSJSON may arrive as a string or object
  const raw = event.arguments?.packageInfo as unknown;
  const packageInfo = typeof raw === 'string' ? JSON.parse(raw) : raw;

  if (!quoteID) throw new Error('quoteID is required');

  // allow null to clear selection (but avoid undefined)
  const clean = packageInfo === undefined ? null : packageInfo;

  await ddbDoc.send(new UpdateCommand({
    TableName: QUOTES,
    Key: { QuoteID: String(quoteID) },
    UpdateExpression: 'SET #pkg.#choice = :val',
    ExpressionAttributeNames: {
      '#pkg': 'Package',
      '#choice': 'packageChoice',
    },
    ExpressionAttributeValues: {
      ':val': clean,
    },
    ConditionExpression: 'attribute_exists(QuoteID)', // fail if quote missing
    ReturnValues: 'NONE',
  }));

  return { message: 'OK' };
};

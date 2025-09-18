import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true },
});
const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

export const handler: Schema['updatePackageChoice']['functionHandler'] = async (event) => {
  const quoteID = event.arguments?.quoteID as string | undefined;
  if (!quoteID) throw new Error('quoteID is required');

  // AWSJSON may arrive as a string or object; decode if needed
  const packageChoice = event.arguments?.packageChoice as string | undefined;
  if (!packageChoice) throw new Error('quoteID is required');

  await ddbDoc.send(new UpdateCommand({
    TableName: QUOTES,
    Key: { QuoteID: String(quoteID) },
    UpdateExpression: 'SET #pkg.#choice = :val',
    ExpressionAttributeNames: {
      '#pkg': 'package',
      '#choice': 'packageChoice',
    },
    ExpressionAttributeValues: { ':val': packageChoice },
    ConditionExpression: 'attribute_exists(QuoteID)',
    ReturnValues: 'NONE',
  }));

  return { message: 'OK' };
};

import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

export const handler: Handler = async (event: any) => {
  try {
    // Accept both Amplify Data (event.arguments) and REST (event.body)
    let quoteID: string | undefined;
    let budget: number | undefined;

    if (event?.arguments) {
      // Amplify Data call
      quoteID = event.arguments.quoteID ?? event.arguments?.payload?.quoteID;
      budget = event.arguments.budget ?? event.arguments?.payload?.budget;
    } else if (event?.body) {
      // REST call
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      quoteID = body?.quoteID;
      budget = body?.budget;
    }

    if (!quoteID || budget === undefined || budget === null || isNaN(Number(budget))) {
      return respond(event, 400, { message: 'Missing or invalid fields: quoteID or budget' });
    }

    const numericBudget = Number(budget);

    const result = await ddbDoc.send(
      new UpdateCommand({
        TableName: QUOTES,
        Key: { QuoteID: String(quoteID) },
        UpdateExpression: 'SET quoteInfo.budget = :b',
        ExpressionAttributeValues: { ':b': numericBudget },
        ReturnValues: 'UPDATED_NEW',
      })
    );

    return respond(event, 200, {
      message: 'Quote updated successfully',
      updatedAttributes: result.Attributes ?? {},
    });
  } catch (e: any) {
    console.error('Error updating quote:', e);
    return respond(event, 500, { message: 'Error updating quote', error: e?.message ?? String(e) });
  }
};

// Unify REST vs Amplify Data responses
function respond(event: any, statusCode: number, payload: any) {
  // REST (API Gateway HTTP) shape
  if (event?.requestContext?.http) {
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(payload),
    };
  }
  // Amplify Data (AppSync Lambda resolver) expects object or throw
  if (statusCode >= 400) {
    throw new Error(payload?.message || 'Error');
  }
  return payload;
}

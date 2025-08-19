import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});
const lambda = new LambdaClient({});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';
const EMAIL_FN = process.env.CONFIRM_EMAIL_FUNCTION || 'SendCustomerConfirmationEmail';

export const handler: Handler = async (event: any) => {
  try {
    // Accept Amplify Data (event.arguments) or REST (event.body)
    let quoteID: string | undefined;

    if (event?.arguments) {
      quoteID = event.arguments.quoteID ?? event.arguments?.payload?.quoteID;
    } else if (event?.body) {
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      quoteID = body?.quoteID;
    }

    if (!quoteID) {
      return respond(event, 400, { message: 'quoteID is required' });
    }

    // 1) Get the quote (404 if not found)
    const got = await ddbDoc.send(
      new GetCommand({ TableName: QUOTES, Key: { QuoteID: String(quoteID) } })
    );
    if (!got.Item) {
      return respond(event, 404, { message: `Quote ${quoteID} not found` });
    }

    // 2) Fire-and-forget email Lambda
    try {
      const payload = { body: { quoteID } };
      await lambda.send(
        new InvokeCommand({
          FunctionName: EMAIL_FN,
          InvocationType: 'Event', // async
          Payload: new TextEncoder().encode(JSON.stringify(payload)),
        })
      );
    } catch (e: any) {
      console.error('Error invoking email Lambda:', e);
      return respond(event, 500, { message: 'Error triggering confirmation email' });
    }

    // 3) Update the quote flags & confirmation number/timestamp
    const confirmationNumber = Math.random().toString(36).slice(2, 10).toUpperCase();
    const timestamp = new Date().toISOString();

    const updated = await ddbDoc.send(
      new UpdateCommand({
        TableName: QUOTES,
        Key: { QuoteID: String(quoteID) },
        UpdateExpression:
          'SET Confirmed = :c, ConfirmationNumber = :n, isAvailable = :a, ConfirmationTimestamp = :t',
        ExpressionAttributeValues: {
          ':c': true,
          ':n': confirmationNumber,
          ':a': 'True', // keeping your original string value
          ':t': timestamp,
        },
        ReturnValues: 'UPDATED_NEW',
      })
    );

    return respond(event, 200, {
      message: `Quote ${quoteID} has been confirmed`,
      confirmationNumber,
      updatedAttributes: updated.Attributes ?? {},
    });
  } catch (e: any) {
    console.error('Unexpected error:', e);
    return respond(event, 500, { message: 'Internal error', error: e?.message ?? String(e) });
  }
};

// Normalize REST (API Gateway) vs Amplify Data (AppSync) responses
function respond(event: any, statusCode: number, payload: any) {
  if (event?.requestContext?.http) {
    // REST
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
  // Amplify Data
  if (statusCode >= 400) throw new Error(payload?.message || 'Error');
  return payload;
}

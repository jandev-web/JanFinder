import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

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

    const resp = await ddbDoc.send(
      new GetCommand({ TableName: QUOTES, Key: { QuoteID: String(quoteID) } })
    );

    if (!resp.Item) {
      return respond(event, 404, { message: 'Quote not found' });
    }

    return respond(event, 200, resp.Item);
  } catch (e: any) {
    console.error('Error retrieving quote:', e);
    return respond(event, 500, { message: 'Error retrieving quote', error: e?.message ?? String(e) });
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
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(payload),
    };
  }
  // Amplify Data
  if (statusCode >= 400) throw new Error(payload?.message || 'Error');
  return payload;
}

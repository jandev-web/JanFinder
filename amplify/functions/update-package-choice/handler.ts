import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

export const handler: Handler = async (event: any) => {
  try {
    // Support Amplify Data (event.arguments) and REST (event.body)
    let quoteID: string | undefined;
    let packageInfo: any;

    if (event?.arguments) {
      quoteID = event.arguments.quoteID ?? event.arguments?.payload?.quoteID;
      packageInfo = event.arguments.packageInfo ?? event.arguments?.payload?.packageInfo;
    } else if (event?.body) {
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      quoteID = body?.quoteID;
      packageInfo = body?.packageInfo;
    }

    if (!quoteID || packageInfo === undefined) {
      return respond(event, 400, { message: 'Missing required fields: quoteID or packageInfo' });
    }

    const result = await ddbDoc.send(
      new UpdateCommand({
        TableName: QUOTES,
        Key: { QuoteID: String(quoteID) },
        UpdateExpression: 'SET #pkg.#choice = :val',
        ExpressionAttributeNames: {
          '#pkg': 'Package',
          '#choice': 'packageChoice',
        },
        ExpressionAttributeValues: {
          ':val': packageInfo,
        },
        ConditionExpression: 'attribute_exists(QuoteID)', // 404 if item not found
        ReturnValues: 'UPDATED_NEW',
      })
    );

    return respond(event, 200, {
      message: 'Package updated successfully',
      updatedAttributes: result.Attributes ?? {},
    });
  } catch (err: any) {
    if (err?.name === 'ConditionalCheckFailedException') {
      return respond(event, 404, { message: 'Quote not found' });
    }
    console.error('Error updating package:', err);
    return respond(event, 500, { message: 'Error updating package', error: err?.message ?? String(err) });
  }
};

// Normalize REST vs Amplify Data responses
function respond(event: any, statusCode: number, payload: any) {
  if (event?.requestContext?.http) {
    // REST (API Gateway / Lambda URL)
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      },
      body: JSON.stringify(payload),
    };
  }
  // Amplify Data (AppSync)
  if (statusCode >= 400) throw new Error(payload?.message || 'Error');
  return payload;
}

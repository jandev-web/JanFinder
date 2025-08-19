import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

export const handler: Handler = async (event: any) => {
  try {
    // Accept Amplify Data (event.arguments) or REST (event.body)
    let quoteID: string | undefined;
    let facilityType: string | undefined;

    if (event?.arguments) {
      quoteID = event.arguments.quoteID ?? event.arguments?.payload?.quoteID;
      facilityType = event.arguments.facilityType ?? event.arguments?.payload?.facilityType;
    } else if (event?.body) {
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      quoteID = body?.quoteID;
      facilityType = body?.facilityType;
    }

    if (!quoteID || !facilityType) {
      return respond(event, 400, { message: 'Missing quoteID or facilityType' });
    }

    const updateExpression = `
      SET quoteInfo.facilityType = :facilityType,
          quoteInfo.roomTypes = :emptyList,
          quoteInfo.floorTypes = :emptyFloor,
          customerMeasurements.roomTypes = :emptyList,
          customerMeasurements.floorTypes = :emptyFloor
    `;

    const expressionAttributeValues = {
      ':facilityType': facilityType,
      ':emptyList': [] as any[],
      ':emptyFloor': { hardfloor: 0, carpet: 0 },
    };

    const result = await ddbDoc.send(
      new UpdateCommand({
        TableName: QUOTES,
        Key: { QuoteID: String(quoteID) },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW',
      })
    );

    return respond(event, 200, {
      message: 'Facility type updated successfully',
      updatedAttributes: result.Attributes ?? {},
    });
  } catch (e: any) {
    console.error('Error updating quote:', e);
    return respond(event, 500, { message: 'Error updating quote', error: e?.message ?? String(e) });
  }
};

// Normalize response for REST (API Gateway) vs Amplify Data (AppSync)
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

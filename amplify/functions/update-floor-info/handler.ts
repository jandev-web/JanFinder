import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});
const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

type FloorInfo = {
  floors: number;
  stairwells?: {
    carpetStairwells?: number;
    hardfloorStairwells?: number;
  };
};

export const handler: Handler = async (event: any) => {
  try {
    // Accept Amplify Data (event.arguments) or REST (event.body)
    let quoteID: string | undefined;
    let floorInfo: FloorInfo | undefined;

    if (event?.arguments) {
      quoteID = event.arguments.quoteID ?? event.arguments?.payload?.quoteID;
      floorInfo = event.arguments.floorInfo ?? event.arguments?.payload?.floorInfo;
    } else if (event?.body) {
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      quoteID = body?.quoteID;
      floorInfo = body?.floorInfo;
    }

    if (!quoteID || !floorInfo) {
      return respond(event, 400, { message: 'Missing quoteID or floorInfo' });
    }

    const floors = Number(floorInfo.floors);
    const carpet = Number(floorInfo.stairwells?.carpetStairwells ?? 0);
    const hardfloor = Number(floorInfo.stairwells?.hardfloorStairwells ?? 0);

    if (Number.isNaN(floors) || Number.isNaN(carpet) || Number.isNaN(hardfloor)) {
      return respond(event, 400, { message: 'floors/stairwells must be numbers' });
    }

    const UpdateExpression = `
      SET quoteInfo.floors = :floors,
          quoteInfo.stairwells.carpet = :carpet,
          quoteInfo.stairwells.hardfloor = :hardfloor,
          customerMeasurements.floors = :floors,
          customerMeasurements.stairwells.carpet = :carpet,
          customerMeasurements.stairwells.hardfloor = :hardfloor
    `;

    const ExpressionAttributeValues = {
      ':floors': floors,
      ':carpet': carpet,
      ':hardfloor': hardfloor,
    };

    const result = await ddbDoc.send(
      new UpdateCommand({
        TableName: QUOTES,
        Key: { QuoteID: String(quoteID) },
        UpdateExpression,
        ExpressionAttributeValues,
        ReturnValues: 'UPDATED_NEW',
      })
    );

    return respond(event, 200, {
      message: 'Quote updated successfully',
      updatedFields: result.Attributes ?? {},
    });
  } catch (e: any) {
    console.error('Error occurred:', e);
    return respond(event, 500, { message: 'Internal server error', error: e?.message ?? String(e) });
  }
};

// Normalize REST vs Amplify Data responses
function respond(event: any, statusCode: number, payload: any) {
  if (event?.requestContext?.http) {
    // REST (API Gateway)
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(payload),
    };
  }
  // Amplify Data (AppSync)
  if (statusCode >= 400) throw new Error(payload?.message || 'Error');
  return payload;
}

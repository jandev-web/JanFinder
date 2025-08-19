import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});
const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

type FormInfo = {
  roomTypes: any[]; // keep flexible to mirror existing payload
  sqft: number;
  floorTypes: Record<string, number>;
};

export const handler: Handler = async (event: any) => {
  try {
    // Support Amplify Data (event.arguments) and REST (event.body)
    let quoteID: string | undefined;
    let formInfo: FormInfo | undefined;

    if (event?.arguments) {
      quoteID = event.arguments.quoteID ?? event.arguments?.payload?.quoteID;
      formInfo = event.arguments.formInfo ?? event.arguments?.payload?.formInfo;
    } else if (event?.body) {
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      quoteID = body?.quoteID;
      formInfo = body?.formInfo;
    }

    if (!quoteID || !formInfo) {
      return respond(event, 400, {
        message: 'Missing required fields (quoteID, formInfo).',
      });
    }

    const { roomTypes, sqft, floorTypes } = formInfo as FormInfo;
    if (
      !roomTypes ||
      typeof sqft !== 'number' ||
      !floorTypes
    ) {
      return respond(event, 400, {
        message:
          'formInfo must contain roomTypes (array), sqft (number), and floorTypes (object).',
      });
    }

    const UpdateExpression = `
      SET quoteInfo.roomTypes = :roomTypes,
          quoteInfo.sqft = :sqft,
          quoteInfo.floorTypes = :floorTypes,
          customerMeasurements.roomTypes = :roomTypes,
          customerMeasurements.sqft = :sqft,
          customerMeasurements.floorTypes = :floorTypes
    `;

    const ExpressionAttributeValues = {
      ':roomTypes': roomTypes,
      ':sqft': sqft,
      ':floorTypes': floorTypes,
    };

    try {
      const result = await ddbDoc.send(
        new UpdateCommand({
          TableName: QUOTES,
          Key: { QuoteID: String(quoteID) },
          UpdateExpression,
          ExpressionAttributeValues,
          ConditionExpression: 'attribute_exists(QuoteID)', // 404 if not found
          ReturnValues: 'UPDATED_NEW',
        })
      );

      return respond(event, 200, {
        message: 'Quote and customerMeasurements updated',
        quoteID,
        updatedAttributes: result.Attributes ?? {},
      });
    } catch (err: any) {
      // ConditionalCheckFailedException -> item not found
      if (err?.name === 'ConditionalCheckFailedException') {
        return respond(event, 404, { message: `QuoteID ${quoteID} not found.` });
      }
      console.error('Error updating quote:', err);
      return respond(event, 500, { message: 'Error updating quote', error: err?.message ?? String(err) });
    }
  } catch (e: any) {
    console.error('Unexpected error:', e);
    return respond(event, 500, { message: 'Internal server error', error: e?.message ?? String(e) });
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

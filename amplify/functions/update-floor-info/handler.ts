import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

type FloorInfo = {
  floors?: number;
  stairwells?: { carpet?: number; hardfloor?: number };
};

// ✅ Amplify Data ONLY
export const handler: Schema['updateFloorInfo']['functionHandler'] = async (event) => {
  const quoteID = event.arguments?.quoteID as string | undefined;

  // AWSJSON may arrive as string or object
  const raw = event.arguments?.floorInfo as unknown;
  const floorInfo: FloorInfo =
    typeof raw === 'string' ? JSON.parse(raw) : (raw ?? {});

  if (!quoteID) throw new Error('quoteID is required');
  if (!floorInfo || typeof floorInfo !== 'object') {
    throw new Error('floorInfo is required and must be an object');
  }

  const floors = Number(floorInfo.floors ?? 0);
  const carpet = Number(floorInfo.stairwells?.carpet ?? 0);
  const hardfloor = Number(floorInfo.stairwells?.hardfloor ?? 0);

  if ([floors, carpet, hardfloor].some(n => Number.isNaN(n))) {
    throw new Error('floors/stairwells must be numbers');
  }

  await ddbDoc.send(new UpdateCommand({
    TableName: QUOTES,
    Key: { QuoteID: String(quoteID) },
    UpdateExpression:
      'SET quoteInfo.floors = :floors,' +
      ' quoteInfo.stairwells.carpet = :carpet,' +
      ' quoteInfo.stairwells.hardfloor = :hardfloor,' +
      ' customerMeasurements.floors = :floors,' +
      ' customerMeasurements.stairwells.carpet = :carpet,' +
      ' customerMeasurements.stairwells.hardfloor = :hardfloor',
    ExpressionAttributeValues: {
      ':floors': floors,
      ':carpet': carpet,
      ':hardfloor': hardfloor,
    },
    ReturnValues: 'NONE',
  }));

  return { message: 'OK' };
};

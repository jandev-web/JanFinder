// amplify/functions/update-quote-rooms/handler.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

type RoomTypeSelection = { roomType: string; count: number };
type FloorTypePercentages = { hardfloor: number; carpet: number };

type FormInfo = Partial<{
  roomTypes: RoomTypeSelection[];
  sqft: number;
  floorTypes: Partial<FloorTypePercentages>;
}>;

// ✅ Amplify Data ONLY
export const handler: Schema['updateQuoteRooms']['functionHandler'] = async (event) => {
  const quoteID = event.arguments?.quoteID as string | undefined;

  // AWSJSON may arrive as a string or an object
  const raw = event.arguments?.formInfo as unknown;
  const formInfo: FormInfo = typeof raw === 'string' ? JSON.parse(raw) : (raw ?? {});

  if (!quoteID) throw new Error('quoteID is required');
  if (!formInfo || typeof formInfo !== 'object') {
    throw new Error('formInfo is required and must be an object');
  }

  // Sanitize shapes & coerce numbers
  const roomTypes: RoomTypeSelection[] = Array.isArray(formInfo.roomTypes)
    ? formInfo.roomTypes.map((r: any) => ({
        roomType: String(r?.roomType ?? ''),
        count: Number(r?.count ?? 0),
      }))
    : [];

  const sqft = Number(formInfo.sqft ?? 0);

  const floorTypes: FloorTypePercentages = {
    hardfloor: Number(formInfo.floorTypes?.hardfloor ?? 0),
    carpet: Number(formInfo.floorTypes?.carpet ?? 0),
  };

  if ([sqft, floorTypes.hardfloor, floorTypes.carpet].some((n) => Number.isNaN(n))) {
    throw new Error('sqft and floorTypes.hardfloor/carpet must be numbers');
  }

  await ddbDoc.send(
    new UpdateCommand({
      TableName: QUOTES,
      Key: { QuoteID: String(quoteID) }, // PK name as in table
      UpdateExpression:
        'SET quoteInfo.roomTypes = :roomTypes,' +
        ' quoteInfo.sqft = :sqft,' +
        ' quoteInfo.floorTypes = :floorTypes,' +
        ' customerMeasurements.roomTypes = :roomTypes,' +
        ' customerMeasurements.sqft = :sqft,' +
        ' customerMeasurements.floorTypes = :floorTypes',
      ExpressionAttributeValues: {
        ':roomTypes': roomTypes,
        ':sqft': sqft,
        ':floorTypes': floorTypes,
      },
      ConditionExpression: 'attribute_exists(QuoteID)', // 404-like behavior if not found
      ReturnValues: 'NONE',
    })
  );

  return { message: 'OK' };
};

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

export const handler: Schema['updateFacilityType']['functionHandler'] = async (event) => {
  const quoteID = event.arguments?.quoteID as string | undefined;
  const facilityType = event.arguments?.facilityType as string | undefined;

  if (!quoteID) throw new Error('quoteID is required');
  if (!facilityType) throw new Error('facilityType is required');

  await ddbDoc.send(
    new UpdateCommand({
      TableName: QUOTES,
      Key: { QuoteID: String(quoteID) },
      // reset dependent fields when facility changes
      UpdateExpression: [
        'SET #qi.#facilityType = :ft',
        '#qi.#roomTypes      = :emptyList',
        '#qi.#floorTypes     = :emptyFloor',
        '#cm.#roomTypes      = :emptyList',
        '#cm.#floorTypes     = :emptyFloor',
      ].join(', '),
      ExpressionAttributeNames: {
        '#qi': 'quoteInfo',
        '#cm': 'customerMeasurements',
        '#facilityType': 'facilityType',
        '#roomTypes': 'roomTypes',
        '#floorTypes': 'floorTypes',
      },
      ExpressionAttributeValues: {
        ':ft': facilityType,
        ':emptyList': [],
        ':emptyFloor': { hardfloor: 0, carpet: 0 },
      },
      ReturnValues: 'NONE',
    })
  );

  return { message: 'OK' };
};

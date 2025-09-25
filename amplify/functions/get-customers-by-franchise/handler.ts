// amplify/functions/get-customers-by-franchise/handler.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

// ===== Tables / indexes (override in backend.ts with env if needed) =====
const CUSTOMER_DATA_TABLE = process.env.CUSTOMER_DATA_TABLE || 'CustomerData';
// GSI where the partition key is the franchise ID (adjust if your name differs)
const FRANCHISE_GSI_NAME  = process.env.CUSTOMER_DATA_FRANCHISE_GSI || 'franchiseID-index';
// Name of the franchise ID attribute in your GSI key schema:
const FRANCHISE_KEY_ATTR  = process.env.CUSTOMER_DATA_FRANCHISE_KEY || 'franchiseID';

type HandlerEvent = {
  arguments?: {
    franchiseID?: string;
    ownerID?: string;
    limit?: number; // optional soft cap, else get all
  };
};

export const handler = async (event: HandlerEvent) => {
  const franchiseID = event?.arguments?.franchiseID?.trim();
  const ownerID     = event?.arguments?.ownerID?.trim();
  const softLimit   = Number(event?.arguments?.limit ?? 0) || undefined;

  if (!franchiseID) throw new Error('franchiseID is required');
  if (!ownerID)     throw new Error('ownerID is required');

  // 1) Query CustomerData by franchise GSI
  const all: any[] = [];
  let lastKey: Record<string, any> | undefined = undefined;

  do {
    const resp: any = await ddb.send(new QueryCommand({
      TableName: CUSTOMER_DATA_TABLE,
      IndexName: FRANCHISE_GSI_NAME,
      // PK = :franchiseID
      KeyConditionExpression: '#fr = :fr',
      ExpressionAttributeNames: { '#fr': FRANCHISE_KEY_ATTR },
      ExpressionAttributeValues: { ':fr': franchiseID },
      ExclusiveStartKey: lastKey,
      // If you pass a soft limit, we'll page until we hit it
      Limit: softLimit ? Math.max(softLimit - all.length, 1) : undefined,
    }));

    const items = resp.Items ?? [];
    all.push(...items);
    lastKey = resp.LastEvaluatedKey;

    if (softLimit && all.length >= softLimit) break;
  } while (lastKey);

  // 2) Split into ownerCustomers vs franchiseCustomers
  //    (We accept either userID or UserID; store uses c.userID in your app, but normalize just in case)
  const getUserId = (c: any) => c?.userID ?? c?.UserID ?? c?.userId;

  const ownerCustomers = all.filter(c => getUserId(c) === ownerID);
  const franchiseCustomers = all.filter(c => getUserId(c) !== ownerID);

  return {
    ownerCustomers,
    franchiseCustomers,
  };
};

export default handler;

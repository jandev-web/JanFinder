import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

const FRANCHISE_TABLE = process.env.FRANCHISE_TABLE || 'Franchise_DB';
const OWNER_TABLE = process.env.OWNER_TABLE || 'Owner_DB';

/**
 * Expected GraphQL/AppSync event:
 * event.arguments = {
 *   franchiseID: string (PK),
 *   ownerID: string,         // NEW: Owner row to mark firstSignIn = true
 *   franchiseName: string,
 *   franchiseAddress: any JSON,
 *   serviceRegions: string[]
 * }
 */
export const handler: Handler = async (event: any) => {
  try {
    const args = event?.arguments ?? {};
    const {
      franchiseID,
      ownerID,                // NEW
      franchiseName,
      franchiseAddress,
      serviceRegions,
    } = args;

    if (!franchiseID) return { ok: false, error: 'Missing required argument: franchiseID' };
    if (!ownerID) return { ok: false, error: 'Missing required argument: ownerID' };

    if (typeof franchiseName !== 'string' || !franchiseName.trim()) {
      return { ok: false, error: 'franchiseName must be a non-empty string' };
    }
    if (serviceRegions && !Array.isArray(serviceRegions)) {
      return { ok: false, error: 'serviceRegions must be an array of strings' };
    }

    // ---- 1) Update the franchise row ----
    const names: Record<string, string> = {};
    const values: Record<string, any> = {};
    const sets: string[] = [];

    const addSet = (attr: string, val: any) => {
      const nameKey = `#${attr}`;
      const valueKey = `:${attr}`;
      names[nameKey] = attr;
      values[valueKey] = val;
      sets.push(`${nameKey} = ${valueKey}`);
    };

    addSet('franchiseName', franchiseName);
    if (typeof franchiseAddress !== 'undefined') addSet('franchiseAddress', franchiseAddress);
    if (typeof serviceRegions !== 'undefined') addSet('serviceRegions', serviceRegions);

    const updateExpr = `SET ${sets.join(', ')}`;

    const franchiseResp = await ddbDoc.send(new UpdateCommand({
      TableName: FRANCHISE_TABLE,
      Key: { FranchiseID: franchiseID },
      UpdateExpression: updateExpr,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW',
    }));

    // ---- 2) If franchise update succeeded, mark Owner.firstSignIn = true ----
    await ddbDoc.send(new UpdateCommand({
      TableName: OWNER_TABLE,
      Key: { OwnerID: ownerID },
      UpdateExpression: 'SET #firstSignIn = :true',
      ExpressionAttributeNames: { '#firstSignIn': 'firstSignIn' },
      ExpressionAttributeValues: { ':true': true },
      ReturnValues: 'UPDATED_NEW',
    }));

    return {
      ok: true,
      message: 'Franchise updated and owner marked as firstSignIn=true',
      franchiseID,
      ownerID,
      franchiseAttributes: franchiseResp.Attributes ?? null,
    };
  } catch (err: any) {
    console.error('update-franchise-info error', err);
    return { ok: false, error: err?.message ?? 'Unknown error' };
  }
};

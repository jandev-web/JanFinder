import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

type Args = { ownerID?: string };

export const handler = async (event: any) => {
  try {
    const args: Args = event?.arguments ?? {};
    const ownerID = (args.ownerID || '').trim();
    if (!ownerID) throw new Error('Missing ownerID');

    const OWNER_TABLE = process.env.OWNER_TABLE!;
    const CBO_TABLE = process.env.CBO_TABLE!;

    // 1. Get Owner → franchiseID
    const ownerRes = await ddb.send(
      new GetCommand({
        TableName: OWNER_TABLE,
        Key: { OwnerID: ownerID },
      })
    );
    const ownerItem = ownerRes.Item;
    if (!ownerItem) return { ok: false, error: 'Owner not found or unauthorized.' };

    const franchiseID =
      ownerItem.franchiseID || ownerItem.FranchiseID || ownerItem.franchiseId;
    if (!franchiseID) return { ok: false, error: 'Franchise ID missing on owner.' };

    // 2. Scan all CBOs with matching franchiseID
    const cboRes = await ddb.send(
      new ScanCommand({
        TableName: CBO_TABLE,
        FilterExpression: '#fid = :fid',
        ExpressionAttributeNames: { '#fid': 'franchiseID' },
        ExpressionAttributeValues: { ':fid': franchiseID },
      })
    );

    const members = (cboRes.Items ?? []).map((cbo) => {
      const copy = { ...cbo };
      delete (copy as any).password;
      return copy;
    });

    return { ok: true, members };
  } catch (err: any) {
    console.error('owner-get-all-members error:', err);
    return { ok: false, error: err?.message ?? 'Unknown error' };
  }
};

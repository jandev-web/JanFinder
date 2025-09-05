import type { Handler } from 'aws-lambda';
import {
  DynamoDBClient
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand
} from '@aws-sdk/lib-dynamodb';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

const TABLE = process.env.SELL_REQUESTS_TABLE || 'SellRequest_DB';
const OWNER_GSI = (process.env.SELL_REQUESTS_GSI_OWNER || '').trim(); // optional

type LambdaEvent = {
  arguments?: { ownerID?: string; quoteID?: string };
  body?: any;
};

function normalize(item: any) {
  if (!item || typeof item !== 'object') return null;
  const r = item as Record<string, any>;
  return {
    id: r.RequestID ?? r.id ?? null,
    quoteID: r.QuoteID ?? r.quoteID ?? null,
    fromOwnerID: r.FromOwnerID ?? r.ownerID ?? null,
    TargetUser: r.TargetUser,
    status: r.Status ?? r.status ?? null,
    createdAt: r.CreatedAt ?? null,
    _raw: r,
  };
}

export const handler: Handler = async (event: LambdaEvent) => {
  // Accept Amplify Data (event.arguments) or REST (event.body)
  const args = event?.arguments ?? (
    event?.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {}
  );
  const ownerID = args?.ownerID;
  const quoteID = args?.quoteID;

  if (!ownerID || !quoteID) {
    throw new Error('getPendingSellRequests: "ownerID" and "quoteID" are required');
  }

  const names = { '#from': 'FromOwnerID', '#status': 'Status', '#qid': 'QuoteID' };
  const vals = { ':owner': ownerID, ':pending': 'PENDING', ':qid': quoteID };

  let items: any[] = [];

  // Prefer Query via GSI (faster). Fall back to Scan if GSI isn’t configured.
  if (OWNER_GSI) {
    const q = await ddbDoc.send(new QueryCommand({
      TableName: TABLE,
      IndexName: OWNER_GSI,
      KeyConditionExpression: '#from = :owner',
      FilterExpression: '#status = :pending AND #qid = :qid',
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: vals,
    }));
    items = q.Items ?? [];
  } else {
    // Fallback (works for small tables; add a GSI for scale)
    const s = await ddbDoc.send(new ScanCommand({
      TableName: TABLE,
      FilterExpression: '#from = :owner AND #status = :pending AND #qid = :qid',
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: vals,
    }));
    items = s.Items ?? [];
  }

  const requests = items.map(normalize).filter(Boolean);
  return { requests };
};

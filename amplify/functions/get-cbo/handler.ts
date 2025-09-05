import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

const CBO_TABLE = process.env.CBO_TABLE || 'CBO_DB';

type LambdaEvent = {
  arguments?: { id?: string };
  body?: any;
};

function normalizeCbo(raw: any) {
  const payload = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (!payload || typeof payload !== 'object') return null;

  // Accept { cbo: {...} } | { data: {...} } | raw object
  const c: Record<string, any> = (payload.cbo ?? payload.data ?? payload) as Record<string, any>;

  // Prefer nested Address object; otherwise build from flat fields
  const addrSrc =
    (c.Address && typeof c.Address === 'object' && c.Address) ||
    (c.address && typeof c.address === 'object' && c.address) || {
      country: c.country ?? '',
      state: c.state ?? '',
      city: c.city ?? '',
      street: c.street ?? '',
      postalCode: c.postalCode ?? c.zip ?? '',
    };

  return {
    id: c.CBOID ?? c.cboID ?? c.cboId ?? c.id ?? null,
    franchiseId: c.FranchiseID ?? c.franchiseId ?? null,
    firstName: c.FirstName ?? c.firstName ?? c.firstname ?? null,
    lastName: c.LastName ?? c.lastName ?? c.lastname ?? null,
    email: c.Email ?? c.email ?? null,
    phone: c.Phone ?? c.phone ?? null,
    address: {
      country: addrSrc.country ?? '',
      state: addrSrc.state ?? '',
      city: addrSrc.city ?? '',
      street: addrSrc.street ?? '',
      postalCode: addrSrc.postalCode ?? addrSrc.zip ?? '',
    },
    createdOn: c.CreatedOn ?? c.createdOn ?? null,
    hasProfilePic: c.HasProfilePic ?? c.hasProfilePic ?? false,
  };
}


export const handler: Handler = async (event: LambdaEvent) => {
  // Accept Amplify Data (event.arguments) or REST (event.body)
  let id = event?.arguments?.id as string | undefined;

  if (!id && event?.body) {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    id = body?.id;
  }

  if (!id || typeof id !== 'string') {
    throw new Error('getCBOById: missing required "id"');
  }

  // Try PK = CBOID first; if not found, try PK = id (fallback)
  const tryKeys = [{ CBOID: id }, { id }];

  for (const Key of tryKeys) {
    const resp = await ddbDoc.send(new GetCommand({ TableName: CBO_TABLE, Key }));
    if (resp.Item) {
      // Return a plain JSON object (Amplify Data expects JSON, not an HTTP response)
      return { cbo: normalizeCbo(resp.Item) };
    }
  }

  // Not found → return null object (easier for client code than throwing)
  return { cbo: null };
};

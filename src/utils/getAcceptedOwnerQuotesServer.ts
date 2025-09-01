'use server';

import { cookies } from 'next/headers';
import { createServerDataClient } from '@/utils/data-server';

export async function getAcceptedQuotesServer(franchiseID: string, ownerID: string): Promise<any[]> {
  const client = createServerDataClient(cookies);

  const res = await client.queries.getAcceptedQuotesOwner(
    { franchiseID, ownerID },
    { authMode: 'userPool' }
  );

  const errs = Array.isArray(res.errors) ? res.errors : [];
  if (errs.length) throw new Error(errs.map(e => e.message).join('; '));

  const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;

  // If your resolver ever returns {statusCode, body}, unwrap:
  if (data && typeof data === 'object' && 'statusCode' in data && 'body' in data) {
    const status = (data as any).statusCode;
    const bodyRaw = (data as any).body;
    if (status !== 200) throw new Error(`getAcceptedQuotesOwner failed: ${bodyRaw}`);
    const body = typeof bodyRaw === 'string' ? JSON.parse(bodyRaw) : bodyRaw;
    return Array.isArray(body) ? body : [];
  }

  return Array.isArray(data) ? data : [];
}

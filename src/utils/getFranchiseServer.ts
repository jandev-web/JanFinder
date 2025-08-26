// src/utils/getFranchiseServer.ts
import 'server-only';
import { cookies } from 'next/headers';
import { createServerDataClient } from '@/utils/data-server';

// returns a list of missing template names, e.g. ['Quote', 'Contract']
// (Adapt to your resolver's exact return shape)
export async function getFranchiseServer(franchiseID: string): Promise<string[]> {
  const client = createServerDataClient(cookies);
  const res = await client.queries.getFranchiseInfo(
    { franchiseID },
    { authMode: 'userPool' }
  );

  const errs = Array.isArray(res.errors) ? res.errors : [];
  if (errs.length) throw new Error(errs.map(e => e.message).join('; '));

  const payload = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
  // accept { missing: [...] } or raw array
  return payload?.missing ?? payload ?? [];
}

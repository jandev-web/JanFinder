'use server';

import 'server-only';
import { cookies } from 'next/headers';
import { createServerDataClient } from '@/utils/data-server';

export default async function deleteFranchiseContractTemplateServer(franchiseID: string) {
  const client = createServerDataClient(cookies);
  const res = await client.mutations.deleteFranchiseContractTemplate({ franchiseID }, { authMode: 'userPool' });

  const errs = Array.isArray(res.errors) ? res.errors : [];
  if (errs.length) throw new Error(errs.map(e => e.message).join('; '));

  // res.data might be AWSJSON (string) or a native array
  const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;

  // If the function ever returned an API-style envelope, unwrap it
  if (data && typeof data === 'object' && 'statusCode' in data && 'body' in data) {
    const status = (data as any).statusCode;
    const bodyRaw = (data as any).body;
    if (status !== 200) throw new Error(`delete contract template failed: ${bodyRaw}`);
    const body = typeof bodyRaw === 'string' ? JSON.parse(bodyRaw) : bodyRaw;
    return Array.isArray(body) ? body : [];
  }

  return Array.isArray(data) ? data : [];
}

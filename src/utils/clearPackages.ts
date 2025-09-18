// utils/clearPackages.ts
'use client';

import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';


export async function clearPackages(quoteID: string) {
  const s = await fetchAuthSession({ forceRefresh: true });
  const mode = s.tokens ? 'userPool' : 'identityPool';


  // no-arg op: pass only the options object
  const res = await getDataClient().queries.clearPackages({ quoteID });
  if (res.errors?.length) {
    res.errors.forEach((e) => console.error('[startQuote] GraphQL error', e));
    throw new Error(`clearPackages failed: ${res.errors.map(e => e.message).join(' | ')}`);
  }

  const payload = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
  if (!payload?.quoteID) throw new Error('Unexpected response from clearPackages');
  return payload;
}

// src/utils/testFranchiseQuoteTemplate.ts
'use client';
import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';

export default async function testFranchiseQuoteTemplate(franchiseID: string) {
  const s = await fetchAuthSession({ forceRefresh: true });
    const mode = s.tokens ? 'userPool' : 'identityPool';
    
  const { data, errors } = await getDataClient().mutations.testFranchiseQuoteTemplate({ franchiseID }, { authMode: mode });
  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));
  const parsed = typeof data === 'string' ? JSON.parse(data) : data;
  return parsed?.quote ?? parsed;
}

// src/utils/testFranchiseContractTemplate.ts
'use client';
import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';

export default async function testFranchiseContractTemplate(franchiseID: string) {
  const s = await fetchAuthSession({ forceRefresh: true });
    const mode = s.tokens ? 'userPool' : 'identityPool';
    
  const { data, errors } = await getDataClient().mutations.testFranchiseContractTemplate({ franchiseID }, { authMode: mode });
  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));
  const parsed = typeof data === 'string' ? JSON.parse(data) : data;
  return parsed?.contract ?? parsed;
}

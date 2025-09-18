// src/utils/updatePackageChoice.ts
'use client';
import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';

type UpdateResult = { message: string };

export async function updatePackageChoice(
  quoteID: string | null,
  packageInfo: unknown
): Promise<UpdateResult> {
  if (!quoteID) throw new Error('quoteID is required');

  // Strip undefined (AWSJSON can’t carry undefined/NaN/Infinity)
  const clean = JSON.parse(JSON.stringify(packageInfo ?? null));

  // IMPORTANT: send AWSJSON as a string
  const awsJson = JSON.stringify(clean);
  const s = await fetchAuthSession({ forceRefresh: true });
  const mode = s.tokens ? 'userPool' : 'identityPool';
  const { data, errors } = await getDataClient().queries.updatePackageChoice(
    { quoteID, packageInfo: awsJson },
    { authMode: mode }
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof (payload as any).message !== 'string') {
    throw new Error('Unexpected response from updatePackage');
  }
  return payload as UpdateResult;
}

export default updatePackageChoice;

// src/utils/updatePackageChoice.ts
'use client';
import { dataClient } from './data-client';

type UpdateResult = { message: string };

export async function updatePackage(
  quoteID: string | null,
  packageInfo: unknown
): Promise<UpdateResult> {
  if (!quoteID) throw new Error('quoteID is required');

  // Strip undefined (AWSJSON can’t carry undefined/NaN/Infinity)
  const clean = JSON.parse(JSON.stringify(packageInfo ?? null));

  // IMPORTANT: send AWSJSON as a string
  const awsJson = JSON.stringify(clean);

  const { data, errors } = await dataClient.queries.updatePackageChoice(
    { quoteID, packageInfo: awsJson },
    { authMode: 'identityPool' }
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof (payload as any).message !== 'string') {
    throw new Error('Unexpected response from updatePackage');
  }
  return payload as UpdateResult;
}

export default updatePackage;

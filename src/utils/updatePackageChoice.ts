// src/utils/updatePackageChoice.ts
'use client';
import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';
import type { PackageChoice } from '@/types/packages';

type UpdateResult = { message: string };

export async function updatePackageChoice(
  quoteID: string | null,
  packageChoice: PackageChoice | null // allow clearing
): Promise<UpdateResult> {
  if (!quoteID) throw new Error('quoteID is required');

  // Enforce string | null at runtime
  const clean: string | null =
    packageChoice === null ? null : String(packageChoice).trim() || null;

  // IMPORTANT: Amplify Data custom resolvers expect AWSJSON as a string
  const awsJson = JSON.stringify(clean); // -> '"middle"' or 'null'

  const s = await fetchAuthSession({ forceRefresh: true });
  const mode = s.tokens ? 'userPool' : 'identityPool';

  const { data, errors } = await getDataClient().queries.updatePackageChoice(
    { quoteID, packageChoice: awsJson }, // keep arg name to match the handler
    { authMode: mode }
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof (payload as any).message !== 'string') {
    throw new Error('Unexpected response from updatePackageChoice');
  }
  return payload as UpdateResult;
}

export default updatePackageChoice;

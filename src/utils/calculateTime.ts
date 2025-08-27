'use client';
import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';

type CalcResult = { packageOptions: any[]; message?: string };

export const calculateTime = async (quoteID: string | null): Promise<CalcResult> => {
  if (!quoteID) throw new Error('quoteID is required');
  const s = await fetchAuthSession({ forceRefresh: true });
  const mode = s.tokens ? 'userPool' : 'identityPool';
  const { data, errors } = await getDataClient().queries.calculatePackageOptions(
    { quoteID },
    { authMode: mode }
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || !Array.isArray(payload.packageOptions)) {
    throw new Error('Unexpected response from calculateTime');
  }
  return payload as CalcResult;
};

export default calculateTime;

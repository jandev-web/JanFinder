'use client';
import { dataClient } from './data-client';

type CalcResult = { packageOptions: any[]; message?: string };

export const calculateTime = async (quoteID: string | null): Promise<CalcResult> => {
  if (!quoteID) throw new Error('quoteID is required');

  const { data, errors } = await dataClient.queries.calculatePackageOptions(
    { quoteID },
    { authMode: 'identityPool' }
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || !Array.isArray(payload.packageOptions)) {
    throw new Error('Unexpected response from calculateTime');
  }
  return payload as CalcResult;
};

export default calculateTime;

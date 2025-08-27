'use client';
import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';

type Result = { message: string };

export default async function updateQuoteFrequency(
  quoteID: string | null,
  frequency: string
): Promise<Result> {
  if (!quoteID) throw new Error('quoteID is required');
  console.log(frequency)
  const s = await fetchAuthSession({ forceRefresh: true });
  const mode = s.tokens ? 'userPool' : 'identityPool';
  const { data, errors } = await getDataClient().queries.updateQuoteFrequency(
    { quoteID, frequency },
    { authMode: mode }
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof payload.message !== 'string') {
    throw new Error('Unexpected response from updateQuoteFrequency');
  }
  return payload as Result;
}

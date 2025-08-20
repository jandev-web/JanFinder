'use client';
import { dataClient } from './data-client';

type Result = { message: string };

export default async function updateQuoteFrequency(
  quoteID: string | null,
  frequency: string
): Promise<Result> {
  if (!quoteID) throw new Error('quoteID is required');
  console.log(frequency)
  const { data, errors } = await dataClient.queries.updateQuoteFrequency(
    { quoteID, frequency },
    { authMode: 'identityPool' }
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof payload.message !== 'string') {
    throw new Error('Unexpected response from updateQuoteFrequency');
  }
  return payload as Result;
}

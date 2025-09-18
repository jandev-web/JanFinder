// src/utils/updateQuoteFrequency.ts
'use client';

import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';
import type { CleaningFrequency } from '@/types/packages';

type Result = { message: string };

/**
 * Sets the quote's cleaning frequency.
 * - Accepts any valid CleaningFrequency OR an empty string '' to clear/reset.
 */
export default async function updateQuoteFrequency(
  quoteID: string | null,
  frequency: CleaningFrequency | ''
): Promise<Result> {
  if (!quoteID) throw new Error('quoteID is required');

  const s = await fetchAuthSession({ forceRefresh: true });
  const authMode = s.tokens ? 'userPool' : 'identityPool';

  const { data, errors } = await getDataClient().queries.updateQuoteFrequency(
    { quoteID, frequency }, // plain string argument (not AWSJSON)
    { authMode }
  );

  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join('; '));
  }

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof payload.message !== 'string') {
    throw new Error('Unexpected response from updateQuoteFrequency');
  }
  return payload as Result;
}

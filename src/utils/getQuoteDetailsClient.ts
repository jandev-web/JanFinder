// src/utils/getQuoteDetailsClient.ts
'use client';
import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';

export default async function getQuoteDetailsClient(quoteID: string) {
  const s = await fetchAuthSession({ forceRefresh: true });
  const mode = s.tokens ? 'userPool' : 'identityPool';
  console.log('[startQuote] session', {
    identityId: s.identityId,
    hasCreds: !!s.credentials,
    hasTokens: !!s.tokens,
    chosenMode: mode,
  });

  const { data, errors } = await getDataClient().queries.getQuote(
    { quoteID },
    { authMode: mode }
  );
  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));
  const parsed = typeof data === 'string' ? JSON.parse(data) : data;
  return parsed?.quote ?? parsed;
}

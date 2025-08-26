'use client';
import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';

type StartQuoteResponse = { quoteID: string; message?: string };

export async function startQuote(): Promise<StartQuoteResponse> {
  console.log('[startQuote] begin');

  const s = await fetchAuthSession({ forceRefresh: true });
  const mode = s.tokens ? 'userPool' : 'identityPool';
  console.log('[startQuote] session', {
    identityId: s.identityId,
    hasCreds: !!s.credentials,
    hasTokens: !!s.tokens,
    chosenMode: mode,
  });

  // no-arg op: pass only the options object
  const res = await getDataClient().queries.createCustomerQuote({ authMode: mode });
  console.log('[startQuote] GraphQL envelope', res);

  if (res.errors?.length) {
    res.errors.forEach((e) => console.error('[startQuote] GraphQL error', e));
    throw new Error(`createCustomerQuote failed: ${res.errors.map(e => e.message).join(' | ')}`);
  }

  const payload = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
  if (!payload?.quoteID) throw new Error('Unexpected response from createCustomerQuote');
  return payload;
}

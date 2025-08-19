// src/utils/startQuote.ts
'use client';
import { dataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';

type StartQuoteResponse = { quoteID: string; message?: string };

export async function startQuote(): Promise<StartQuoteResponse> {
  // forceRefresh ensures we pick up the new IAM policy
  const s = await fetchAuthSession({ forceRefresh: true });
  console.log('identityId:', s.identityId, 'hasCreds:', !!s.credentials, 'hasTokens:', !!s.tokens?.accessToken);

  const { data, errors } =
    await dataClient.queries.createCustomerQuote({ authMode: 'identityPool' });

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));
  if (!data || typeof (data as any).quoteID !== 'string') {
    throw new Error('Unexpected response from createCustomerQuote');
  }
  return data as StartQuoteResponse;
}

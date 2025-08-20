// src/utils/startQuote.ts
'use client';
import { dataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';
import { debugIdentity } from './debug-identity';
type StartQuoteResponse = { quoteID: string; message?: string };

export async function startQuote(): Promise<StartQuoteResponse> {
  // forceRefresh ensures we pick up the new IAM policy
  const s = await fetchAuthSession({ forceRefresh: true });

  const { data, errors } =
    await dataClient.queries.createCustomerQuote({ authMode: 'identityPool' });

  const payload = typeof data === 'string' ? JSON.parse(data) : data;

  if (!payload || typeof payload.quoteID !== 'string') {
    throw new Error('Unexpected response from createCustomerQuote');
  }
  return payload as { quoteID: string; message?: string };

}
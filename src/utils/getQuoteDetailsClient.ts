// src/utils/getQuoteDetailsClient.ts
'use client';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const dataClient = generateClient<Schema>();

export default async function getQuoteDetailsClient(quoteID: string) {
  const { data, errors } = await dataClient.queries.getQuote(
    { quoteID },
    { authMode: 'identityPool' }
  );
  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));
  const parsed = typeof data === 'string' ? JSON.parse(data) : data;
  return parsed?.quote ?? parsed;
}

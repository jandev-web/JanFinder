// utils/OwnerAcceptQuote.ts
'use server';
import 'server-only';
import { cookiesClient } from '@/utils/amplify-utils';

export async function acceptQuoteOwnerAction(
  quoteID: string,
  franchiseID: string,
  ownerID: string
) {
  const { data, errors } = await cookiesClient.mutations.ownerAcceptQuote(
    { quoteID, franchiseID, ownerID },
    { authMode: 'userPool' }
  );
  if (errors?.length) throw new Error(errors.map(e => e.message).join(' | '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (payload?.statusCode !== 200) throw new Error(payload?.message ?? 'Failed to accept quote');
  return payload;
}

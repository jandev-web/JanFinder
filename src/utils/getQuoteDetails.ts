'use client';
import { dataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';



export default async function getQuoteDetails(quoteID: string): Promise<any> {

    const s = await fetchAuthSession({ forceRefresh: true });

    const { data, errors } = await dataClient.queries.getQuote(
        { quoteID },
        { authMode: 'identityPool' }
    );
    
    if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  // Your schema uses a.json(), so `data` is an AWSJSON string
  const parsed = typeof data === 'string' ? JSON.parse(data) : data; // { message, quote }
  const quote = parsed?.quote;

  if (quote && typeof quote.quoteID !== 'string') {
    throw new Error('Malformed quote payload');
  }
  return quote; // null ⇒ "not found"
}


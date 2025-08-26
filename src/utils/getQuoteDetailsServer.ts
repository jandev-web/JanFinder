import 'server-only';
import { cookies } from 'next/headers';
import { createServerDataClient } from '@/utils/data-server';


export default async function getQuoteDetails(quoteID: string) {
    const serverDataClient = createServerDataClient(cookies);
    const { data, errors } = await serverDataClient.queries.getQuote(
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


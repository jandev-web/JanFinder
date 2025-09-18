'use client';

// TODO: update this import to wherever your startQuote() lives
// e.g. "@/utils/startQuote" or "@/api/quotes/start"
import { startQuote } from '@/utils/startQuote';


export async function StartQuoteAction({
  push,
  setLoading,
}: {
  push: (href: string) => void;
  setLoading?: (isLoading: boolean) => void;
}) {
  try {
    setLoading?.(true);

    const res = await startQuote();
    const quoteID =
      res?.QuoteID;

    if (!quoteID) {
      throw new Error('startQuote() did not return a quoteID');
    }

    push(`/get-a-quote/start?qid=${encodeURIComponent(quoteID)}`);
  } catch (err) {
    console.error('Failed to start quote:', err);
    // Swap this for your toast/UX of choice
    alert('Sorry—could not start a new quote. Please try again.');
  } finally {
    setLoading?.(false);
  }
}

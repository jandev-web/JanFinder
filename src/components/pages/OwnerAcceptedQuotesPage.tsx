'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/loadingScreen';
import OwnerFooter from '../OwnerFooter';
import OwnerHeader from '../OwnerHeader';
import OwnerAcceptedQuoteCard from '@/components/OwnerAcceptedQuoteCard';

type OwnerAcceptedQuotesPageProps = {
  ownerData: any;
  quotes: any[];     // Each item may be { quoteDetails, requestDetails } per handler
  franchise: any;
};

function normalizeQuote(item: any) {
  // The handler returns { quoteDetails, requestDetails }.
  // Fall back to the item itself if it's already a raw quote.
  return item?.quoteDetails ?? item ?? {};
}

const OwnerAcceptedQuotesPage: React.FC<OwnerAcceptedQuotesPageProps> = ({
  ownerData,
  quotes,
  franchise,
}) => {
  const router = useRouter();
  console.log(quotes)
  if (!ownerData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const handleQuoteClick = (quote: any) => {
    const q = normalizeQuote(quote);
    if (q?.QuoteID) {
      router.push(`/members/owner/quote/accepted?quoteID=${encodeURIComponent(q.QuoteID)}`);
    }
  };

  const hasQuotes = Array.isArray(quotes) && quotes.length > 0;

  return (
    <div className="flex w-full flex-col min-h-screen bg-white">
      <div className="pb-10">
        <OwnerHeader user={ownerData} />
      </div>

      <div className="pt-24 px-4 md:px-8">
        <button
          className="mb-6 text-lg font-semibold text-blue-700 hover:text-yellow-500 transition"
          onClick={() => router.push('/members/owner/quotes')}
        >
          &lt; Back to All Quotes
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-[#001F54] text-center">
          Accepted Quotes
        </h1>

        {!hasQuotes ? (
          <div className="mt-6 text-center">
            <div className="mt-4 mb-4 text-[#001F54]">No accepted quotes yet.</div>
            <button
              className="px-6 py-3 bg-yellow-500 text-[#001F54] text-lg font-semibold rounded-lg shadow-md hover:bg-yellow-400 hover:shadow-lg hover:scale-105 transform transition"
              onClick={() => router.push('/members/owner/quotes/available')}
            >
              Browse Available Quotes
            </button>
          </div>
        ) : (
          <ul className="space-y-4 mt-6 max-w-4xl mx-auto">
            {quotes.map((item, idx) => {
              const q = normalizeQuote(item);
              // You can also read item.requestDetails here if you want to show a badge.
              return (
                <li key={q?.QuoteID ?? idx}>
                  <OwnerAcceptedQuoteCard
                    quote={q}
                    requestDetails={item.requestDetails}
                    onClick={() => handleQuoteClick(item)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <OwnerFooter />
    </div>
  );
};

export default OwnerAcceptedQuotesPage;

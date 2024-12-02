'use client';

import React from 'react';
import QuoteListCard from '@/components/QuoteListCard';

interface Quote {
  customerData: {
    firstName: string;
    lastName: string;
  };
  QuoteID: string;
}

interface SingleCBOQuoteListProps {
  quotes: Quote[];
}

const SingleCBOQuoteList: React.FC<SingleCBOQuoteListProps> = ({ quotes }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Accepted Quotes</h2>

        {/* Scrollable list */}
        <div className="h-80 overflow-y-auto">
          {quotes.length === 0 ? (
            <p className="text-gray-500">No quotes available</p>
          ) : (
            quotes.map((quote) => (
              <div key={quote.QuoteID} className="mb-4">
                <QuoteListCard quote={quote} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCBOQuoteList;

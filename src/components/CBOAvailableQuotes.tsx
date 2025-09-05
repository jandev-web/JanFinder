'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CBOAvaQuoteCard from './CBOAvaQuoteCard';
import LoadingSpinner from '@/components/LoadingScreenPhrase';
import fetchAvailableCBOQuotes from '@/utils/getAvailableQuotesCBO';
import checkFranchiseTemplates from '@/utils/checkForFranTemplates';

type Address = {
  city: string;
  postalCode: string;
  state: string;
};

interface Quote {
  QuoteID: string;
  costInfo: {
    finalCost: number;
  };
  CBO: string;
  Timestamp: string;
  Package: {
    name: string;
    cost: number;
  };
  customerData: {
    firstName: string;
    lastName: string;
    company: string;
    address: Address;
  };
  quoteInfo: {
    sqft: string;
  };
}

interface AvaQuotesProps {
  user: any;
  quotes: any;
}

const CBOAvaQuotes: React.FC<AvaQuotesProps> = ({ user, quotes }) => {
  
  const router = useRouter()
  const cboID = user?.CBOID;
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log(quotes)

  

  

  return (
    <div className="relative">
      <button
        className="absolute top-4 left-4 pt-2 pb-10 pl-4 pr-4 text-lg font-semibold text-blue-700 hover:text-yellow-500 transition duration-300"
        onClick={() => router.push('/members/cbo/quotes')}
      >
        &lt; Back to All Quotes
      </button>
      <div className={`p-8 pt-16 text-center transition-all`}>
        <h1 className="text-4xl font-bold text-blue-800">Available Quotes</h1>
        {quotes.length === 0 ? (
          <div className="mt-4 text-gray-600">No Available Quotes found.</div>
        ) : (
          <ul className="space-y-4 mt-6">
            {quotes.map((quote: any) => (
              <li key={quote.QuoteID}>
                <CBOAvaQuoteCard
                  quote={quote}
                  timezone={userTimeZone}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CBOAvaQuotes;

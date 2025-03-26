'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OwnerQuoteCard from '@/components/OwnerQuoteCard';
import LoadingSpinner from '@/components/loadingScreen';
import fetchOwnerById from '@/utils/getOwnerById'
import fetchAvailableQuotes from '@/utils/getAvailableQuotesOwner';


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
}

const OwnerAvaQuotes: React.FC<AvaQuotesProps> = ({ user }) => {
  const [range, setRange] = useState(25); // Initial range in miles
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [quotes, setAvaQuotes] = useState<Quote[]>([]);
  const router = useRouter();
  const ownerID = user?.OwnerID;
  const [error, setError] = useState<string | null>(null);

  
  // Set loading to false after the quotes are available
  //console.log(user)
  const handleQuoteClick = (quote: Quote) => {
    router.push(`/members/owner/quote/available?quoteID=${quote.QuoteID}`);
  };

  useEffect(() => {
    if (ownerID) {
      const fetchQuotes = async () => {
        try {
          const data = await fetchAvailableQuotes(ownerID);
          console.log(data)
          setAvaQuotes(data)
          setLoading(false);
        } catch (error) {
          console.error('Error fetching quotes:', error);
          setLoading(false);
        }
      };

      fetchQuotes();
    }
  }, [ownerID]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        className="absolute top-4 left-4 pt-2 pb-10 pl-4 pr-4 text-lg font-semibold text-[#001F54] hover:text-yellow-500 transition duration-300"
        onClick={() => router.push('/members/owner/quotes')}
      >
        &lt; Back to All Quotes
      </button>
      <div className="p-8 pt-16 text-center">
        <h1 className="text-4xl font-bold text-[#001F54]">Available Quotes</h1>
        {quotes.length === 0 ? (
          <div>No Available Quotes found.</div>
        ) : (
          <ul className="space-y-4 mt-6">
            {quotes.map((quote) => (
              <li key={quote.QuoteID}>
                <OwnerQuoteCard quote={quote} onClick={() => handleQuoteClick(quote)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

  );
};

export default OwnerAvaQuotes;

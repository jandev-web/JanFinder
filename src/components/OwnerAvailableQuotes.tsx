'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OwnerQuoteCard from '@/components/OwnerQuoteCard';
import LoadingSpinner from '@/components/loadingScreen';
import fetchOwnerById from '@/utils/getOwnerById'
import fetchFilteredQuotes from '@/utils/getFilteredQuotesOwner';

interface Quote {
  QuoteID: string;
  Franchise: string;
  CBO: string;
  Package: {
    name: string;
    cost: number;
  };
  customerData: {
    firstName: string;
    lastName: string;
    company: string;
  };
}

interface AvaQuotesProps {
  user: any;
}

const OwnerAvaQuotes: React.FC<AvaQuotesProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [quotes, setAvaQuotes] = useState<Quote[]>([]);
  const router = useRouter();
  const ownerID = user?.sub;
  const [error, setError] = useState<string | null>(null);

  // Set loading to false after the quotes are available

  const handleQuoteClick = (quote: Quote) => {
    router.push(`/members/owner/quote?quoteID=${quote.QuoteID}`);
  };

  useEffect(() => {
    if (ownerID) {
      const fetchQuotes = async () => {
        try {
          const data = await fetchFilteredQuotes(ownerID);
          console.log(data)
          setAvaQuotes(data.availableQuotes)
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
    <div>
      <button
        className="absolute top-4 left-4 pt-16 text-green-700 hover:text-yellow-500 transition duration-300"
        onClick={() => router.push('/members/owner/quotes')}
      >
        Back
      </button>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-green-500">Available Quotes</h1> {/* Big, Green Title */}
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

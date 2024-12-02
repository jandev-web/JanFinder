'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OwnerQuoteCard from '@/components/OwnerQuoteCard';
import LoadingSpinner from '@/components/loadingScreen';
import fetchOwnerById from '@/utils/getOwnerById'
import getFranchiseInfo from '@/utils/getFranchiseInfo'
import fetchFilteredQuotes from '@/utils/getFilteredQuotesOwner';


interface Quote {
  QuoteID: string;
  Franchise: string;
  CBO: string,
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

interface AccQuotesProps {
  user: any;
}

const OwnerAccQuotes: React.FC<AccQuotesProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const ownerID = user?.sub;
  const [franInfo, setFranInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [quotes, setAccQuotes] = useState<Quote[]>([]);
  const [memberQuotes, setMemQuotes] = useState<Quote[]>([]);

  // Set loading to false after the quotes are available
  //console.log(user)

  const handleQuoteClick = (quote: Quote) => {
    router.push(`/members/owner/quote?quoteID=${quote.QuoteID}&page=acc`);
  };

  useEffect(() => {
    if (ownerID) {
      const fetchQuotes = async () => {
        try {
          const data = await fetchFilteredQuotes(ownerID);
          console.log(data)
          setAccQuotes(data.customerConfirmed)
          setMemQuotes(data.memberConfirmed)
          setLoading(false);
        } catch (error) {
          console.error('Error fetching quotes:', error);
          setLoading(false);
        }
      };

      fetchQuotes();
    }
  }, [ownerID]);

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      if (user?.sub) {
        try {
          const fetchedOwnerInfo = await fetchOwnerById(user.sub);
          //console.log(fetchedOwnerInfo)
          const franchiseInfo = await getFranchiseInfo(fetchedOwnerInfo.franchiseID)
          setFranInfo(franchiseInfo.franchiseName);

        } catch (err) {
          setError('Failed to fetch owner information');
          console.error('Error fetching owner info:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOwnerInfo();
  }, [user]);

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
        <h1 className="text-4xl font-bold text-green-500">{franInfo}&apos;s Quotes</h1> {/* Big, Green Title */}
        {(quotes?.length === 0) && (memberQuotes.length === 0) ? (
          <div>No Accepted Quotes found.</div>
        ) : (
          <div>
            <div>
              <h2>Customer Submited Quotes</h2>
              <ul className="space-y-4 mt-6">
                {quotes?.map((quote) => (
                  <li key={quote.QuoteID}>
                    <OwnerQuoteCard quote={quote} onClick={() => handleQuoteClick(quote)} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Member Submited Quotes</h2>
              <ul className="space-y-4 mt-6">
                {memberQuotes?.map((quote) => (
                  <li key={quote.QuoteID}>
                    <OwnerQuoteCard quote={quote} onClick={() => handleQuoteClick(quote)} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerAccQuotes;

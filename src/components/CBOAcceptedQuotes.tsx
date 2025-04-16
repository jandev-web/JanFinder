'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CBOQuoteCard from '@/components/CBOQuoteCard';
import LoadingSpinner from '@/components/loadingScreen';

import getFranchiseInfo from '@/utils/getFranchiseInfo'
import getCBOQuotes from '@/utils/getCBOQuotes';


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

interface AccQuotesProps {
  user: any;
}

const CBOAccQuotes: React.FC<AccQuotesProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const CBOID = user?.CBOID;
  const franchiseID = user?.franchiseID
  const [franInfo, setFranInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const userName = `${user.firstName} ${user.lastName}`
  

  const handleQuoteClick = (quote: Quote) => {
    router.push(`/members/cbo/quote/accepted?id=${quote.QuoteID}`);
  };

  useEffect(() => {
    if (CBOID) {
      const fetchInfo = async () => {
        try {
          const data = await getCBOQuotes(CBOID);
          
          setQuotes(data.quotes)
          
          const franchiseInfo = await getFranchiseInfo(franchiseID)
          setFranInfo(franchiseInfo.franchiseName);
          setLoading(false);

        } catch (error) {
          console.error('Error fetching quotes:', error);
          setLoading(false);
        }
      };

      fetchInfo();
    }
  }, [CBOID]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='relative'>

      <button
        className="absolute top-4 left-4 pt-2 pb-2 pl-4 pr-4 text-lg font-semibold hover:text-yellow-500 text-[#001F54] transition duration-300"
        onClick={() => router.push('/members/cbo/quotes')}
      >
        &lt; Back to All Contracts
      </button>
      {/* Other component content goes here */}



      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold text-[#001F54] mb-10">
          {userName}&apos;s <span className="text-yellow-500">Contracts</span>
        </h1>

        <div>
          <div>
            <h2 className="text-2xl font-bold text-center">
              <span className="text-yellow-500">Purchased Contracts</span>
            </h2>
            {/* Grey line under the h2 */}
            <div className="border-b border-gray-300 mx-auto mt-2"></div>

            {(quotes?.length === 0) ? (
              <div>
                <div className="mt-4 mb-4 text-[#001F54]">No Purchased Contracts Yet.</div>
                <button
                  className="px-6 py-3 bg-yellow-500 text-[#001F54] text-lg font-semibold rounded-lg shadow-md hover:bg-yellow-400 hover:shadow-lg hover:scale-105 transform transition duration-300"
                  onClick={() => router.push('/members/cbo/quotes/available')}
                >
                  Click here to purchase contracts!
                </button>

              </ div>

            ) : (
              <ul className="space-y-4 mt-6">
                {quotes?.map((quote) => (
                  <li key={quote.QuoteID}>
                    <CBOQuoteCard quote={quote} onClick={() => handleQuoteClick(quote)} />
                  </li>
                ))}
              </ul>)}


          </div>
        </div>

      </div>
    </div>




  );
};

export default CBOAccQuotes;


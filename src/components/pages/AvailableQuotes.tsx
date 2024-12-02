'use client';
import React, { useEffect, useState } from 'react';
import getCBOQuotes from '../../utils/getCBOQuotes';
import CBOQuoteCard from '../CBOQuoteCard';
import { useRouter } from 'next/navigation';
import fetchCBOById from '@/utils/getCBOByID';
import filterQuotesByDistance from '@/utils/filterQuoteLocation';

type Address = {
  city: string;
  postalCode: string;
  state: string;
};

interface Quote {
  QuoteID: string;
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

interface AvailableQuotesProps {
  user: any;
}

const AvailableQuotes: React.FC<AvailableQuotesProps> = ({ user }) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(25); // Initial range in miles
  const [address, setAddress] = useState('');
  const cboID = user?.sub;
  const type = 'available';

  const router = useRouter();

  useEffect(() => {
    if (cboID) {
      const fetchQuotes = async () => {
        try {
          const data = await getCBOQuotes(cboID, type);
          const cboInfo = await fetchCBOById(cboID);
          const cboAddress = cboInfo.address;
          const stringAddress = `${cboAddress.city} ${cboAddress.state}, ${cboAddress.postalCode}`;
          setAddress(stringAddress);
          const unfilteredQuotes = data.quotes;
          const filteredQuotes = await filterQuotesByDistance(unfilteredQuotes, cboAddress, range);
          setQuotes(filteredQuotes);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching quotes:', error);
          setLoading(false);
        }
      };

      fetchQuotes();
    }
  }, [cboID, range]);

  const handleQuoteClick = (quote: Quote) => {
    router.push(`/members/cbo/quote?quoteID=${quote.QuoteID}&cboID=${cboID}&page=ava`);
  };

  const currentTime = new Date().getTime();

  // Define categorizedQuotes with literal types using `as const`
  const categorizedQuotes = {
    fiveMinutes: [] as Quote[],
    oneHour: [] as Quote[],
    twentyFourHours: [] as Quote[],
  } as const;

  // Categorize quotes based on time left to expiration
  quotes.forEach((quote) => {
    const quoteTime = new Date(quote.Timestamp).getTime();
    const timeLeft = quoteTime + 24 * 60 * 60 * 1000 - currentTime;

    if (timeLeft <= 5 * 60 * 1000) {
      categorizedQuotes.fiveMinutes.push(quote);
    } else if (timeLeft <= 60 * 60 * 1000) {
      categorizedQuotes.oneHour.push(quote);
    } else if (timeLeft <= 24 * 60 * 60 * 1000) {
      categorizedQuotes.twentyFourHours.push(quote);
    }
  });

  // Sort quotes within each category by Timestamp
  (Object.keys(categorizedQuotes) as Array<keyof typeof categorizedQuotes>).forEach((key) => {
    categorizedQuotes[key].sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
  });

  return (
    <div>
      <button
        className="absolute top-4 left-4 pt-16 text-green-700 hover:text-yellow-500 transition duration-300"
        onClick={() => router.push('/members/cbo/quotes')}
      >
        Back
      </button>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-green-500">Available Quotes</h1>

        {/* Filter Distance Box */}
        <div className="mt-6 mb-4">
          <label className="text-lg font-semibold text-gray-700">Filter Distance (miles) from {address}:</label>
          <input
            type="number"
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            className="ml-2 p-2 border border-gray-300 rounded w-20 text-center"
          />
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {/* Quotes Expiring in 5 Minutes */}
            <div className="border border-gray-300 rounded p-4 overflow-y-auto max-h-80">
              <h2 className="text-2xl font-semibold text-red-500 mb-4">Expiring in 5 Minutes</h2>
              {categorizedQuotes.fiveMinutes.length === 0 ? (
                <div>No quotes expiring in 5 minutes.</div>
              ) : (
                categorizedQuotes.fiveMinutes.map((quote) => (
                  <CBOQuoteCard key={quote.QuoteID} quote={quote} onClick={() => handleQuoteClick(quote)} />
                ))
              )}
            </div>

            {/* Quotes Expiring in 1 Hour */}
            <div className="border border-gray-300 rounded p-4 overflow-y-auto max-h-80">
              <h2 className="text-2xl font-semibold text-orange-500 mb-4">Expiring in 1 Hour</h2>
              {categorizedQuotes.oneHour.length === 0 ? (
                <div>No quotes expiring in 1 hour.</div>
              ) : (
                categorizedQuotes.oneHour.map((quote) => (
                  <CBOQuoteCard key={quote.QuoteID} quote={quote} onClick={() => handleQuoteClick(quote)} />
                ))
              )}
            </div>

            {/* Quotes Expiring in 24 Hours */}
            <div className="border border-gray-300 rounded p-4 overflow-y-auto max-h-80">
              <h2 className="text-2xl font-semibold text-yellow-500 mb-4">Expiring in 24 Hours</h2>
              {categorizedQuotes.twentyFourHours.length === 0 ? (
                <div>No quotes expiring in 24 hours.</div>
              ) : (
                categorizedQuotes.twentyFourHours.map((quote) => (
                  <CBOQuoteCard key={quote.QuoteID} quote={quote} onClick={() => handleQuoteClick(quote)} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableQuotes;

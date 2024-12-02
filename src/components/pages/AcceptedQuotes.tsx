'use client';

import React, { useState, useEffect } from 'react';
import getCBOQuotes from '../../utils/getCBOQuotes';
import { useRouter } from 'next/navigation';
import CBOQuoteCard from '../CBOQuoteCard';


type Address = {
  city: string;
  postalCode: string;
  state: string;
}
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

interface AcceptedQuotesProps {
  user: any;
}

const AcceptedQuotes: React.FC<AcceptedQuotesProps> = ({ user }) => {
  //console.log(user)
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const cboID = user?.sub;
  const type = 'accepted';

  const router = useRouter();

  useEffect(() => {
    if (cboID) {
      const fetchQuotes = async () => {
        try {
          const data = await getCBOQuotes(cboID, type);
          console.log(data)
          setQuotes(data.quotes);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching quotes:', error);
          setLoading(false);
        }
      };

      fetchQuotes();
    }
  }, [cboID]);

  const handleQuoteClick = (quote: Quote) => {
    router.push(`/members/cbo/quote?quoteID=${quote.QuoteID}&cboID=${cboID}&page=acc`);
  };

  

  return (
    <div>
      <button
        className="absolute top-4 left-4 pt-16 text-green-700 hover:text-yellow-500 transition duration-300"
        onClick={() => router.push('/members/cbo/quotes')}
      >
        Back
      </button>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-green-500">Accepted Quotes</h1> {/* Big, Green Title */}
        {quotes.length === 0 ? (
          <div>You have not accepted any quotes yet.</div>
        ) : (
          <ul className="space-y-4 mt-6">
            {quotes.map((quote) => (
              <li key={quote.QuoteID}>
                <CBOQuoteCard quote={quote} onClick={() => handleQuoteClick(quote)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AcceptedQuotes;

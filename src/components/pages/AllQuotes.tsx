'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/loadingScreen';

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
  };
}

interface AllQuotesProps {
  user: any;
}

const AllQuotes: React.FC<AllQuotesProps> = ({ user }) => {
  const [accQuotes, setAccQuotes] = useState<Quote[]>([]);
  const [avaQuotes, setAvaQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulating loading data
    setTimeout(() => setLoading(false), 1000); // Remove or adjust as per your actual data fetching logic
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 py-10">
  {/* Available Quotes Section */}
  <div className="flex flex-col items-center">
    <h2 className="text-2xl font-bold text-[#001F54]">
      Quote Bidding Platform
    </h2>
    <p className="text-sm text-gray-700 text-center mt-1">
      Browse available quotes and place your bid to win the best deals.
    </p>
    <button
      className="mt-4 w-56 py-2 bg-yellow-500 text-[#001F54] font-semibold rounded-lg hover:bg-yellow-400 transition"
      onClick={() => router.push('/members/owner/quotes/available')}
    >
      Enter the quote Bidding platform:
    </button>
  </div>

  {/* Accepted Quotes Section */}
  <div className="flex flex-col items-center">
    <h2 className="text-2xl font-bold text-[#001F54]">Accepted Quotes</h2>
    <p className="text-sm text-gray-700 text-center mt-1">
      Review the quotes that have been accepted and are in progress.
    </p>
    <button
      className="mt-4 w-56 py-2 bg-yellow-500 text-[#001F54] font-semibold rounded-lg hover:bg-yellow-400 transition"
      onClick={() => router.push('/members/owner/quotes/accepted')}
    >
      Accepted Quotes
    </button>
  </div>

  {/* Start Quote Section */}
  <div className="flex flex-col items-center">
    <h2 className="text-2xl font-bold text-[#001F54]">Start a Quote</h2>
    <p className="text-sm text-gray-700 text-center mt-1">
      Initiate a new quote process and get started quickly.
    </p>
    <button
      className="mt-4 w-56 py-2 bg-yellow-500 text-[#001F54] font-semibold rounded-lg hover:bg-yellow-400 transition"
      onClick={() => router.push('/members/start-quote')}
    >
      Start Quote
    </button>
  </div>
</div>

  );
};

export default AllQuotes;

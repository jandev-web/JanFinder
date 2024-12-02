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
    <div className="flex flex-col items-center gap-4 py-10">
      <button
        className="w-48 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        onClick={() => router.push('/members/owner/quotes/accepted')}
      >
        Accepted Quotes
      </button>
      <button
        className="w-48 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        onClick={() => router.push('/members/owner/quotes/available')}
      >
        Available Quotes
      </button>
      <button
        className="w-48 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        onClick={() => router.push('/members/startQuote')}
      >
        Start Quote
      </button>
    </div>
  );
};

export default AllQuotes;

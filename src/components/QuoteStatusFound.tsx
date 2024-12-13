'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import QuoteFoundFacility from './QuoteFoundFacility';
import QuoteFoundCost from './QuoteFoundCost';
import QuoteFoundCleaner from './QuoteFoundCleaner';
import QuoteStatusFoundCard from './QuoteFoundCard';
const QuoteStatusFound: React.FC<{ quote: any }> = ({ quote }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#001F54] to-[#003a85] text-yellow-200 p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push('/quote-status')}
        className="text-yellow-400 text-lg mb-6 self-start hover:underline transition duration-300"
      >
        &lt; Back
      </button>

      {/* Header */}
      <h1 className="text-4xl font-extrabold text-yellow-400 text-center mb-8">
        Quote Found!
      </h1>

      <QuoteStatusFoundCard quote={quote}/>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-lg">
          Need to check another quote?{' '}
          <span
            onClick={() => router.push('/quote-status')}
            className="text-yellow-400 underline cursor-pointer hover:text-yellow-300 transition duration-300"
          >
            Click here
          </span>
        </p>
      </div>
    </div>
  );
};

export default QuoteStatusFound;

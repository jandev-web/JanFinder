'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import QuoteForm from '../QuoteForm';
import LoadingSpinner from '@/components/loadingScreen';

const Quote: React.FC = () => {
  const searchParams = useSearchParams();
  const quoteID = searchParams.get('quoteID');

  if (!quoteID) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="quote-container bg-gradient-to-r from-[#001F54] to-blue-600 p-8 rounded-xl shadow-lg max-w-4xl mx-auto text-white">
      {/* Step Title */}
      <div className="mb-6 text-center">
        <h2 className="text-4xl font-extrabold text-yellow-400 mb-4">Step 2: Facility Details</h2>
        <p className="text-lg leading-relaxed">
          Let us know about your facility. Enter the square footage, select the facility type, and tell us about the rooms within it. We&apos;ll use this
          information to create the most accurate quote and recommend the best cleaning package for your needs.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <QuoteForm quoteID={quoteID} />
      </div>
    </div>
  );
};

export default Quote;

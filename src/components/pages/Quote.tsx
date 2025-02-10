'use client';

import React, { useEffect, useState } from 'react';
import QuoteForm from '../QuoteForm';
import LoadingSpinner from '@/components/loadingScreen';

const Quote: React.FC = () => {
  const [quoteID, setQuoteID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedQuoteID = sessionStorage.getItem('customerData');
      
      setQuoteID(storedQuoteID);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!quoteID) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
        <p className="text-white mt-4">No quote found, please start the process again.</p>
      </div>
    );
  }

  return (
    <div className="quote-container bg-gradient-to-r from-[#001F54] to-blue-600 p-8 rounded-xl shadow-lg max-w-4xl mx-auto text-white">
      {/* Step Title */}
      <div className="mb-6 text-center">
        <h2 className="text-4xl font-extrabold text-yellow-400 mb-4">Step 2: Facility Details</h2>
        <p className="text-lg leading-relaxed">
          Let us know about your facility. Select the facility type. We&apos;ll use this
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

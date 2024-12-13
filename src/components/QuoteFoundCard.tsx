'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import QuoteFoundFacility from './QuoteFoundFacility';
import QuoteFoundCost from './QuoteFoundCost';
import QuoteFoundCleaner from './QuoteFoundCleaner';

const QuoteStatusFoundCard: React.FC<{ quote: any }> = ({ quote }) => {
  const router = useRouter();

  return (
      
      <div className="bg-white text-[#001F54] rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
        <p className="text-lg mb-4">
          <strong>Confirmation Number:</strong> {quote.ConfirmationNumber}
        </p>
        <p className="text-lg mb-4">
          <strong>Name:</strong> {quote.customerData.firstName} {quote.customerData.lastName}
        </p>
        <p className="text-lg mb-4">
          <strong>Email:</strong> {quote.email}
        </p>

        {/* Facility Info */}
        <QuoteFoundFacility facilityInfo={quote.quoteInfo} />

        {/* Cost Info */}
        <QuoteFoundCost costInfo={quote.costInfo} />

        {/* Cleaner Info (if accepted) */}
        {quote.IsAccepted && <QuoteFoundCleaner cleanerInfo={quote.cleanerData} />}

        {/* Status */}
        <p className="text-lg mb-4">
          <strong>Status:</strong>{' '}
          <span
            className={`font-bold ${quote.IsAccepted ? 'text-green-500' : 'text-yellow-500'}`}
          >
            {quote.IsAccepted ? 'Accepted' : 'Pending'}
          </span>
        </p>
      </div>

      
  );
};

export default QuoteStatusFoundCard;

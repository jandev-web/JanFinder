'use client';

import React from 'react';

interface Quote {
  customerData: {
    firstName: string;
    lastName: string;
  };
}

interface QuoteListCardProps {
  quote: Quote;
}

const QuoteListCard: React.FC<QuoteListCardProps> = ({ quote }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <p className="text-lg text-gray-700">
        <strong>Customer:</strong> {quote.customerData.firstName} {quote.customerData.lastName}
      </p>
    </div>
  );
};

export default QuoteListCard;

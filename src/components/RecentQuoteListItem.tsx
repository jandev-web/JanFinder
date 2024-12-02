'use client';

import React, { useState, useEffect } from 'react';


interface Quote {
  Timestamp: string;
  Package: any,
  customerData: any
}

interface RecentQuotesListItemProps {
  quote: Quote;
}

const NewQuoteEventListItem: React.FC<RecentQuotesListItemProps> = ({ quote }) => {
  console.log(quote)
  
  

  return (
    <div className="mb-4 border-b pb-2">
      <p className="font-bold text-green-500">New Quote!</p>
      <p className="text-sm text-gray-600">{new Date(quote.Timestamp).toLocaleString()}</p>
      <p className="text-sm text-gray-600">Customer:  {quote.customerData.firstName} {quote.customerData.lastName}</p>
      <p className="text-sm text-gray-600">Price:  ${quote.Package?.cost}</p>

    </div>
  );
};

export default NewQuoteEventListItem;

'use client'
import React, { useEffect, useState } from 'react';
import formatTimestamp from '@/utils/formatTimestamp'
type Address = {
  city: string;
  postalCode: string;
  state: string;
}

type Quote = {
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
    address: Address
  };
  quoteInfo: {
    sqft: string;
  };
};

interface QuoteCardProps {
  quote: Quote;
  onClick: () => void;
}

const CBOQuote: React.FC<QuoteCardProps> = ({ quote, onClick }) => {
  const { Package, customerData, quoteInfo } = quote;
  const [error, setError] = useState<string | null>(null);
  const address = customerData.address
  const stringAddress = `${address.city} ${address.state}, ${address.postalCode}`
  const quoteTime = formatTimestamp(quote.Timestamp)
  
  return (
    <button
      onClick={onClick}
      className="w-full bg-white hover:bg-yellow-300 border border-gray-300 p-4 rounded-lg shadow-lg text-left transition duration-200 ease-in-out"
      disabled={error !== null}
    >
      <div className="quote-card">
        <p className="customer-name">
          <strong>Customer:</strong> {customerData.company} 
        </p>
        <p>
          <strong>Location:</strong> {stringAddress} 
        </p>
        <p>
          <strong>Submitted At:</strong> {quoteTime} 
        </p>

        {Package && (
          <div className="package-info">
            <p>
              <strong>Cost:</strong> ${Package.cost.toFixed(2)}
            </p>
            <p>
              <strong>Size:</strong> {quoteInfo.sqft} sqft
            </p>
          </div>
        )}
      </div>
    </button>
  );
};

export default CBOQuote;

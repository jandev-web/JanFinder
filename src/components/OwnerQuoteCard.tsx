'use client';
import React, { useEffect, useState } from 'react';
import fetchCBOById from '@/utils/getCBOByID';
import getFranchiseInfo from '@/utils/getFranchiseInfo';
type Address = {
  city: string;
  postalCode: string;
  state: string;
};
interface Quote {
  QuoteID: string;
  costInfo: {
    finalCost: number;
  };
  CBO: string;
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

interface QuoteCardProps {
  quote: Quote;
  onClick: () => void;
}

const OwnerQuoteCard: React.FC<QuoteCardProps> = ({ quote, onClick }) => {
  const { costInfo, Package, customerData } = quote;
  const [error, setError] = useState<string | null>(null);
  console.log(quote)
  console.log(costInfo)

  
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

        {Package && (
          <div className="package-info">
            <p>
              <strong>Cost:</strong> ${costInfo?.finalCost}
            </p>
          </div>
        )}
      </div>
    </button>
  );
};

export default OwnerQuoteCard;

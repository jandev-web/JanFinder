'use client';
import React, { useEffect, useState } from 'react';
import fetchCBOById from '@/utils/getCBOByID';
import getFranchiseInfo from '@/utils/getFranchiseInfo';

type Quote = {
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
    company: string;
  };
};

interface QuoteCardProps {
  quote: Quote;
  onClick: () => void;
}

const OwnerQuoteCard: React.FC<QuoteCardProps> = ({ quote, onClick }) => {
  const { Franchise, CBO, Package, customerData } = quote;
  const [error, setError] = useState<string | null>(null);
  
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
              <strong>Cost:</strong> ${Package.cost.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </button>
  );
};

export default OwnerQuoteCard;

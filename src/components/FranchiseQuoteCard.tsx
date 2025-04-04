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
  OwnerID: string;
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

const FranchiseQuoteCard: React.FC<QuoteCardProps> = ({ quote, onClick }) => {
  const { costInfo, Package, customerData, OwnerID } = quote;
  const [error, setError] = useState<string | null>(null);
  const [cboName, setCBOName] = useState<string>('');
  
  //console.log(quote)
  //console.log(costInfo)

  useEffect(() => {
        const fetchData = async () => {
          try {
            if (OwnerID) {
              const cboData = await fetchCBOById(OwnerID);
              setCBOName(`${cboData.firstName} ${cboData.lastName}`)
            } else {
              console.error('Owner ID not provided');
            }
    
          } catch (error) {
            console.error('Error fetching user role or quote details:', error);
          }
        };
    
        fetchData();
      }, [quote]);

  
  return (
    <button
  onClick={onClick}
  className="w-full bg-white border border-gray-200 p-6 rounded-md shadow-md text-left transition-colors duration-200 ease-in-out hover:bg-yellow-50 disabled:opacity-50"
  disabled={error !== null}
>
  <div className="space-y-3">
    <p className="text-lg font-semibold text-gray-800">
      <span className="font-bold">Customer:</span> {customerData.company}
    </p>
    {Package && (
      <p className="text-base text-gray-700">
        <span className="font-bold">Price:</span> ${costInfo?.finalCost}
      </p>
    )}
    {cboName !== '' && (
      <p className="text-base text-gray-700">
        <span className="font-bold">Quote Owner:</span> {cboName}
      </p>
    )}
  </div>
</button>

  );
};

export default FranchiseQuoteCard;

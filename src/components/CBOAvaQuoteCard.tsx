'use client';

import React from 'react';
import { useRouter } from 'next/navigation';



interface QuoteCardProps {
  quote: any;
  userAddress: any;
  timezone: any;
}

const CBOAvaQuoteCard: React.FC<QuoteCardProps> = ({ quote, timezone }) => {
  const { cost, quotePackage, customerAddress, company, facility, frequency, sqft, offerTime, requestID } = quote;
  const router = useRouter();
  console.log(timezone)
  // Parse the offerTime into a Date object.
  const date = new Date(offerTime);
  
  // Define options for date formatting (literal types) and include the user's timeZone if provided.
  const formattedDateTime = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timezone // For example, "America/New_York" from Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  
  
  // Format the address (from customerAddress)
  const address = `${customerAddress.street}, ${customerAddress.city} ${customerAddress.state} ${customerAddress.postalCode}`;
  
  const handleClick = () => {
    // Navigate to the route with the requestID as a URL parameter.
    router.push(`/members/cbo/quote/available?id=${requestID}`);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-gradient-to-r from-white to-gray-50 hover:from-yellow-100 hover:to-yellow-200 border border-gray-300 p-6 rounded-xl shadow-lg text-left transition transform duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400"
    >
      <div>
        <p className="text-xl font-semibold text-blue-800 mb-1">{company}</p>
        <p className="text-sm text-gray-700">
          <span className="font-bold">Cost:</span> ${cost}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-bold">Facility Type:</span> {facility}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-bold">Area:</span> {sqft} sqft.
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-bold">Frequency:</span> {frequency}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-bold">Address:</span> {address}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-bold">Package:</span> {quotePackage}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-bold">Offer Sent:</span> {formattedDateTime}
        </p>
      </div>
    </button>
  );
};

export default CBOAvaQuoteCard;

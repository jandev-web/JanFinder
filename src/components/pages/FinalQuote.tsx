// components/FinalQuote.tsx
'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import UploadPDFForm from '../UploadPDF';
import GeneratePDFForm from '../GeneratePDF';

const FinalQuote: React.FC = () => {
  const searchParams = useSearchParams();

  const quoteDetails = {
    quoteID: searchParams.get('quoteID') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    sqft: searchParams.get('sqft') || '',
    windows: searchParams.get('windows') || '',
    carpets: searchParams.get('carpets') || '',
    packageName: searchParams.get('packageName') || '',
    packageCost: searchParams.get('packageCost') || '',
    packageDescription: searchParams.get('packageDescription') || '',
    packageServices: JSON.parse(searchParams.get('packageServices') || '[]'),
    windowCost: searchParams.get('windowCost') || '',
    sqftCost: searchParams.get('sqftCost') || '',
    bathCost: searchParams.get('bathCost') || '',
    carpetCost: searchParams.get('carpetCost') || '',
    quoteName: searchParams.get('quoteName') || '',
  };

  return (
    <div className="final-quote-container">
      <h2>Quote Cost</h2>
      <p>Your Package: {quoteDetails.packageName}</p>
      <p>Your total cost is: ${quoteDetails.packageCost}</p>
      <p>Window cost: ${quoteDetails.windowCost}</p>
      <p>Square feet cost: ${quoteDetails.sqftCost}</p>
      <p>Bathroom cost: ${quoteDetails.bathCost}</p>
      <p>Carpet cost: ${quoteDetails.carpetCost}</p>
      <p>Bathrooms: {quoteDetails.bathrooms}</p>
      <p>Square Feet: {quoteDetails.sqft}</p>
      <p>Windows: {quoteDetails.windows}</p>
      <p>Carpets: {quoteDetails.carpets === 'true' ? 'Yes' : 'No'}</p>
      <GeneratePDFForm quoteDetails={quoteDetails} />
      <UploadPDFForm quoteID={quoteDetails.quoteID} />
    </div>
  );
};

export default FinalQuote;

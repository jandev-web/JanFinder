'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const CongratulationsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Customer'; // Default to "Customer" if no name is provided
  const conNum = searchParams.get('con')
  const handleReturnHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Congratulations, {name}!</h1>
        <p className="text-gray-700 text-lg mb-8">
          Your quote has been submitted for bidding, and you will be notified within 24 hours when a winner emerges! Sit tight!
        </p>
        <h2 className="text-gray-700 text-lg mb-8">
          Your Confirmation Number:
        </h2>
        <p className="text-gray-700 text-lg mb-8">
          {conNum}
        </p>

        <button
          onClick={handleReturnHome}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default CongratulationsPage;

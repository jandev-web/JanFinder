'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const QuoteStatusNotFound: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#001F54] text-white">
      <button
        onClick={() => router.push('/quote-status')}
        className="absolute top-4 left-4 text-yellow-400 text-lg"
      >
        &lt; Back
      </button>
      <h1 className="text-3xl font-bold mb-4">Quote Not Found</h1>
      <p className="text-lg">
        We couldn’t find a quote matching the provided email and confirmation number.
      </p>
    </div>
  );
};

export default QuoteStatusNotFound;

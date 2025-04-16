// @/components/HeroSection.tsx
'use client';

import React from 'react';
import { startQuote } from '@/utils/startQuote';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  onLoading: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onLoading }) => {
  const router = useRouter();

  const startNewQuote = async () => {
    onLoading();
    const result = await startQuote();
    console.log(result.quoteID)
    sessionStorage.setItem('customerData', result.quoteID);
    router.push('/get-a-quote/start');
  };

  return (
    <div className="relative bg-gradient-to-b from-[#001F54] to-blue-800 text-white p-12 rounded-lg shadow-lg">
      <h1 className="text-5xl font-extrabold mb-6">Get a Quote in Seconds</h1>
      <p className="text-lg font-medium mb-8">
        Many cleaning companies are waiting to bid on your request and provide the best, most competitive prices. Let us simplify the process for you.
      </p>
      <button
        onClick={startNewQuote}
        className="bg-yellow-400 hover:bg-yellow-500 text-[#001F54] font-bold py-3 px-6 rounded-lg transition duration-300 cursor-pointer"
      >
        Get Started Now
      </button>
    </div>
  );
};

export default HeroSection;

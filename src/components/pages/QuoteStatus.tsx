'use client';

import React from 'react';
import QuoteStatusIntro from '@/components/QuoteStatusIntro';
import CheckStatus from '@/components/CheckStatus';

const QuoteStatus: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-[#001F54] to-[#003a85] text-white min-h-screen">
      {/* Introduction Section */}
      <QuoteStatusIntro />

      {/* Check Status Form */}
      <main className="container mx-auto px-6 py-8">
        <CheckStatus />
      </main>
    </div>
  );
};

export default QuoteStatus;

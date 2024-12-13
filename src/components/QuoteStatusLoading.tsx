'use client';

import React from 'react';

const QuoteStatusLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-[#001F54] text-yellow-400">
      <h1 className="text-3xl font-bold animate-pulse">Loading your quote...</h1>
    </div>
  );
};

export default QuoteStatusLoading;

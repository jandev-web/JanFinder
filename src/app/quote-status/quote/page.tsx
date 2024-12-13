'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuoteStatusQuote from '@/components/pages/QuoteStatusQuotePage';
import SmallHeader from '@/components/SmallHeader';


const QuoteStatusQuotePage = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="block md:hidden">
        <SmallHeader />
      </div>

      {/* Ensures Home takes up all available space between Header and Footer */}
      <div className="flex-grow pt-32 pb-0 mb-0">
        <QuoteStatusQuote />
      </div>
      <div className="pt-0 mt-0">
        <Footer />
      </div>

    </div>

  );
};

export default QuoteStatusQuotePage;
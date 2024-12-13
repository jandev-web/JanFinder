'use client';

import React from 'react';
import Header from '@/components/Header';
import FAQS from '@/components/pages/FAQS';
import Footer from '@/components/Footer';
import SmallHeader from '@/components/SmallHeader';

const FAQPage = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Conditional Rendering Based on Screen Size */}
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="block md:hidden">
        <SmallHeader />
      </div>

      {/* Ensures Home takes up all available space between Header and Footer */}
      <div className="flex-grow">
        <FAQS />
      </div>
      <div className="pt-0 mt-0">
        <Footer />
      </div>
    </div>
  );
};

export default FAQPage;

'use client';

import React from 'react';
import FaqIntro from '@/components/FaqIntro';
import CustomerQuestions from '@/components/CustomerQuestions';
import OwnerQuestions from '@/components/OwnerQuestions';
import BidQuestions from '@/components/BidQuestions';
import OwnerToolsQuestions from '@/components/OwnerToolsQuestions';
import GuarenteeQuestions from '@/components/GuarenteeQuestions';
import QuoteQuestions from '@/components/QuoteQuestions';
import PriceToolQuestions from '@/components/PriceToolQuestions';

const FAQS: React.FC = () => {
  return (
    <div className="md:mt-24">
      {/* Introduction Section */}
      <FaqIntro />
      <CustomerQuestions />
      <OwnerQuestions />
      <BidQuestions />
      <OwnerToolsQuestions />
      <GuarenteeQuestions />
      <QuoteQuestions />
      <PriceToolQuestions />

    </div>
  );
};

export default FAQS;

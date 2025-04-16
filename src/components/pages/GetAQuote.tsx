// pages/getAQuote.tsx
'use client';

import React from 'react';
import HeroSection from '@/components/GetAQuoteHero';
import HowItWorks from '@/components/GetAQuoteHowItWorks';
import WhyChooseUs from '@/components/GetAQuoteWhyChooseUs';
import CallToAction from '@/components/GetAQuoteCallToAction';
import LoadingSpinner from '../loadingScreen';

function GetAQuotePage() {
  const [loading, setLoading] = React.useState(false);
  const handleLoading = () => {
    setLoading(true);
  
  }
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="space-y-16 px-6 py-12 bg-gray-50 min-h-screen">
      <HeroSection onLoading={handleLoading}/>
      <HowItWorks />
      <WhyChooseUs />
      <CallToAction onLoading={handleLoading}/>
    </div>
  );
};

export default GetAQuotePage;

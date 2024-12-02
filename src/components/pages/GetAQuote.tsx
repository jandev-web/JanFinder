// pages/getAQuote.tsx
'use client';

import React from 'react';
import HeroSection from '@/components/GetAQuoteHero';
import HowItWorks from '@/components/GetAQuoteHowItWorks';
import WhyChooseUs from '@/components/GetAQuoteWhyChooseUs';
import CallToAction from '@/components/GetAQuoteCallToAction';

const GetAQuotePage = () => (
  <div className="space-y-16 px-6 py-12 bg-gray-50 min-h-screen">
    <HeroSection />
    <HowItWorks />
    <WhyChooseUs />
    <CallToAction />
  </div>
);

export default GetAQuotePage;

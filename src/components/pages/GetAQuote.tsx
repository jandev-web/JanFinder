'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; 
import HeroSection from '@/components/GetAQuoteHero';
import HowItWorks from '@/components/GetAQuoteHowItWorks';
import WhyChooseUs from '@/components/GetAQuoteWhyChooseUs';
import CallToAction from '@/components/GetAQuoteCallToAction';
import LoadingSpinner from '../loadingScreen';
import { StartQuoteAction } from '@/utils/startQuoteClientAction'; // keep your path

function GetAQuotePage() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onClickStart = React.useCallback(() => {
    setLoading(true);
    StartQuoteAction({
      push: (href: string) => router.push(href),
      
    });
  }, [router]); // ✅ depend on router, not router.push

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen space-y-16 bg-gray-50 px-6 py-12">
      <HeroSection onClick={onClickStart} />
      <HowItWorks />
      <WhyChooseUs />
      <CallToAction onClick={onClickStart} />
    </div>
  );
}

export default GetAQuotePage;

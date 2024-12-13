'use client';

import React from 'react';
import Header from '../Header';
import Home from './Home';
import Footer from '@/components/Footer';
import SmallHeader from '@/components/SmallHeader';

const LandingPage = () => {
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
        <Home />
      </div>
      <div className="pt-0 mt-0">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;

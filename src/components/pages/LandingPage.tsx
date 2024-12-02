'use client';

import React from 'react';
import Header from '../Header';
import Home from './Home';
import Footer from '@/components/Footer'

const LandingPage = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header />

      {/* Ensures Home takes up all available space between Header and Footer */}
      <div className="flex-grow pt-26">
        <Home />
      </div>
      <div className="pt-0 mt-0">
        <Footer />
      </div>

    </div>

  );
};

export default LandingPage;

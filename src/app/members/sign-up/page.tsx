'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SignUpPage from '@/components/pages/SignUp';


const FranchiseListPage: React.FC = () => {

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header />

      {/* Ensures Home takes up all available space between Header and Footer */}
      <div className="flex-grow pt-28 pb-0 mb-0">
        <SignUpPage />
      </div>
      <div className="pt-0 mt-0">
        <Footer />
      </div>

    </div>

  );
};


export default FranchiseListPage;

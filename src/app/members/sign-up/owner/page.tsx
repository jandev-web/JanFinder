'use client';

import React from 'react';
import MemberLandingHeader from '@/components/MemberLandingHeader';
import MemberLandingFooter from '@/components/MemberLandingFooter';
import OwnerSignUpPage from '@/components/pages/OwnerSignUp';


const OwnerSignUp: React.FC = () => {

  return (
    <div className="flex flex-col w-full min-h-screen">
      <MemberLandingHeader />

      {/* Ensures Home takes up all available space between Header and Footer */}
      <div className="flex-grow pb-0 mb-0">
        <OwnerSignUpPage />
      </div>
      <div className="pt-0 mt-0">
        <MemberLandingFooter />
      </div>

    </div>

  );
};


export default OwnerSignUp;

'use client';

import React from 'react';
import MemberLandingHeader from '@/components/MemberLandingHeader';
import MemberLandingFooter from '@/components/MemberLandingFooter';
import SelfCBOSignUpPage from '@/components/pages/SelfCBOSignUpPage';


const CBOInvitePage: React.FC = () => {

  return (
    <div className="flex flex-col w-full min-h-screen">
      <MemberLandingHeader />

      {/* Ensures Home takes up all available space between Header and Footer */}
      <div className="flex-grow pb-0 mb-0">
        <SelfCBOSignUpPage />
      </div>
      <div className="pt-0 mt-0">
        <MemberLandingFooter />
      </div>

    </div>

  );
};


export default CBOInvitePage;

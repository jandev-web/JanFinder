'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import MemberLoadingScreen from '@/components/pages/MemberPageLoading'
import MemberLandingHeader from '@/components/MemberLandingHeader';
import GetStarted from '@/components/ComeSignUp'
import AlreadyAccount from '@/components/AlreadyAccount'
const MemberLandingPage: React.FC = () => {

  return (
    <div className="bg-[#001F54] min-h-screen text-white">
      <MemberLandingHeader />
      <div
        className="flex flex-col justify-center items-center p-6 bg-cover bg-center h-screen"
        style={{ backgroundImage: "url('/images/MembersPageIcon.jpeg')", backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      >

        <div className="bg-black bg-opacity-50 p-10 rounded-lg">
          <div className="flex justify-center pb-6">
            <h2 className="text-5xl text-white font-extrabold">Members Area</h2>
          </div>
          <div className='pb-10'>
            <GetStarted />
          </div>

          <AlreadyAccount />
        </div>

      </div>
    </div>
  );


};

export default MemberLandingPage;


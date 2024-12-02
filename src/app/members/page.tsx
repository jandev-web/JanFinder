'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MemberLoadingScreen from '@/components/pages/MemberPageLoading'
import Image from 'next/image';
import GetStarted from '@/components/ComeSignUp'
import AlreadyAccount from '@/components/AlreadyAccount'
const MemberLandingPage: React.FC = () => {
  const router = useRouter();

  return (
    <div>
      <button
        className="absolute top-4 left-4 text-green-700 hover:text-yellow-500 transition duration-300"
        onClick={() => router.push('/')}
      >
        Return to Main Page
      </button>
      <div className="flex flex-col justify-center items-center p-6">
          <Image
            src="/images/logo.jpeg"
            alt="JanFinder Logo"
            width={120} // Adjust the size of the logo
            height={120}
            className="rounded-full border-2 border-gray-300 shadow-lg"
            priority
          />
          <h1 className="text-3xl text-green-700 font-bold mt-4">
            Members Area
          </h1>
        </div>
      <div className="pt-16">
        <GetStarted />
      </div>
      <div className="pt-16">
        <AlreadyAccount />
      </div>
    </div>
  );
};

export default MemberLandingPage;


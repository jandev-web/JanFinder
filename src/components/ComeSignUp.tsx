'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const GetStarted: React.FC = () => {
  const router = useRouter();

  return (
    <div className="relative bg-yellow-500 shadow-lg rounded-lg p-8 text-center mx-auto max-w-lg">
      <h2 className="text-2xl font-bold text-green-900 mb-4">
        Don&apos;t have an account yet?
      </h2>
      <p className="text-gray-800 mb-6">
        Get started today and begin receiving competitive quotes!
      </p>
      <button
        className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
        onClick={() => router.push('/members/signUp')}
      >
        Get Started Here!
      </button>

      {/* Animated Graphics */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-300 rounded-full opacity-75 animate-ping"></div>
      <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-white rounded-full opacity-75 animate-pulse"></div>
      <div className="absolute -bottom-10 -right-20 w-16 h-16 bg-green-700 rounded-full opacity-75 animate-bounce"></div>
    </div>
  );
};

export default GetStarted;

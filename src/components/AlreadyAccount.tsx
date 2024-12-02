'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const AlreadyAccount: React.FC = () => {
  const router = useRouter();

  return (
    <div className="relative bg-green-700 shadow-lg rounded-lg p-8 text-center mx-auto max-w-lg">
      <h2 className="text-2xl font-bold text-white mb-4">
        Already have an account?
      </h2>
      <p className="text-gray-200 mb-6">
        Sign in to access your account and manage your cleaning quotes.
      </p>
      <button
        className="bg-white text-green-700 hover:bg-yellow-500 font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
        onClick={() => router.push('/members/signIn')}
      >
        Sign In Here!
      </button>

      {/* Animated Graphics */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-green-500 rounded-full opacity-75 animate-ping"></div>
      <div className="absolute -top-10 -left-10 w-16 h-16 bg-yellow-400 rounded-full opacity-75 animate-pulse"></div>
      <div className="absolute -bottom-10 -left-20 w-20 h-20 bg-white rounded-full opacity-75 animate-spin"></div>
    </div>
  );
};

export default AlreadyAccount;

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const AlreadyAccount: React.FC = () => {
  const router = useRouter();

  return (
    <div className="relative bg-white shadow-lg rounded-lg p-8 text-center mx-auto max-w-lg">
      <h2 className="text-2xl font-bold text-[#001F54] mb-4">
        Already have an account?
      </h2>
      <p className="text-[#001F54] mb-6">
        Sign in to access your account and manage your cleaning quotes.
      </p>
      <button
        className="hover:bg-[#001F54] bg-yellow-500 hover:text-white text-[#001F54] font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
        onClick={() => router.push('/members/sign-in')}
      >
        Sign In Here!
      </button>

      
      
    </div>
  );
};

export default AlreadyAccount;

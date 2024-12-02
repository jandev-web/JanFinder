'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

const LoginError: React.FC = () => {
  const router = useRouter();

  const handleRetry = () => {
    router.push('/members/signIn');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-yellow-300 p-6">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center transform transition-all hover:scale-105 duration-300">
        <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Oops! Something went wrong.
        </h1>
        <p className="text-gray-700 mb-6">
          We encountered an issue while trying to log you in. Please try again, or click the button below to return to the sign-in page.
        </p>
        <button
          onClick={handleRetry}
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition duration-300"
        >
          Retry Sign In
        </button>
      </div>
    </div>
  );
};

export default LoginError;

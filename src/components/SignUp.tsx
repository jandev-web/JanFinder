'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const SignUp: React.FC = () => {
  const router = useRouter();

  const handleOwnerSignUp = () => {
    router.push('/members/sign-up/owner');
  };

  const handleMemberSignUp = () => {
    router.push('/members/sign-up/cbo');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-[#001F54] mb-12">
        Create Your Bid2Clean Account
      </h1>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* Franchise Owner Box (Yellow) */}
        <div className="bg-yellow-500 text-[#001F54] rounded-lg shadow-lg p-8 flex-1">
          <h2 className="text-2xl font-bold mb-4">Franchise Owner</h2>
          <p className="mb-6">
            Sign up as a Franchise Owner to manage your franchise, oversee operations, and expand your business.
          </p>
          <button
            onClick={handleOwnerSignUp}
            className="py-2 px-4 bg-[#001F54] text-white font-bold rounded hover:bg-blue-700 transition"
          >
            Sign Up as Owner
          </button>
        </div>
        {/* Franchise Member Box (Blue) */}
        <div className="bg-[#001F54] text-white rounded-lg shadow-lg p-8 flex-1">
          <h2 className="text-2xl font-bold mb-4">Franchise Member</h2>
          <p className="mb-6">
            Sign up as a Franchise Member to join a leading network, bid on cleaning projects, and build your career.
          </p>
          <button
            onClick={handleMemberSignUp}
            className="py-2 px-4 bg-yellow-500 text-[#001F54] font-bold rounded hover:bg-yellow-400 transition"
          >
            Sign Up as Member
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

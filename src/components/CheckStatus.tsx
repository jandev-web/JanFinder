'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import getQuoteStatus from '@/utils/getQuoteStatus'
const CheckStatus: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isConfirmationNumberValid = (confirmationNumber: string) => {
    return /^[a-zA-Z0-9]{8}$/.test(confirmationNumber); // Matches exactly 8 digits
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Checking status for:', { email, confirmationNumber });
    const queryParams = new URLSearchParams({
        con: confirmationNumber,
        email: email
      });
    router.push(`/quote-status/quote?${queryParams.toString()}`);
  };

  return (
    <section className="bg-white text-[#001F54] shadow-md rounded-lg p-8 mt-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6">
        Enter Your Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-lg font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded border border-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <div>
          <label
            htmlFor="confirmationNumber"
            className="block text-lg font-medium mb-2"
          >
            Confirmation Number
          </label>
          <input
            type="text"
            id="confirmationNumber"
            name="confirmationNumber"
            placeholder="Enter your confirmation number"
            value={confirmationNumber}
            onChange={(e) => setConfirmationNumber(e.target.value)}
            required
            className="w-full px-4 py-2 rounded border border-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        {isEmailValid(email) && isConfirmationNumberValid(confirmationNumber) && (
          <button
            type="submit"
            className="w-full bg-yellow-400 text-[#001F54] text-lg font-medium px-6 py-3 rounded shadow-lg hover:bg-[#001F54] hover:text-white transition duration-300"
          >
            Check Status
          </button>
        )}
      </form>
    </section>
  );
};

export default CheckStatus;

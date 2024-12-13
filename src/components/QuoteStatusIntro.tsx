'use client';

import React from 'react';

const QuoteStatusIntro: React.FC = () => {
  return (
    <section className="text-center py-16 bg-[#001F54] text-white">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-yellow-400">
          Check Your Quote Status
        </h1>
        <p className="text-lg lg:text-xl italic text-yellow-200 mt-4 max-w-3xl mx-auto">
          Keeping track of your cleaning quote has never been easier! With
          JanFinder, you can conveniently check the status of your quotes right
          here. Whether you&apos;re planning ahead or making last-minute
          arrangements, our easy-to-use tool provides you with the information
          you need in just seconds. Simply enter your email and confirmation
          number below to stay in the loop and on top of your cleaning service
          arrangements. It&apos;s fast, reliable, and part of the exceptional service
          we deliver every day.
        </p>
      </div>
    </section>
  );
};

export default QuoteStatusIntro;

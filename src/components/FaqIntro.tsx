'use client';

import React from 'react';

const FaqIntro: React.FC = () => {
  return (
    <section className="text-center py-16 bg-[#001F54] text-white">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-yellow-400">
          Frequently Asked Questions
        </h1>
        <p className="text-lg lg:text-xl italic text-yellow-200 mt-4 max-w-3xl mx-auto">
          Welcome to our FAQ section! Here, you&apos;ll find answers to common
          questions about JanFinder, whether you&apos;re a customer looking for
          cleaning quotes or a business owner exploring tools to manage your
          cleaning company more effectively.
        </p>
      </div>
    </section>
  );
};

export default FaqIntro;

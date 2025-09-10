'use client';

import React from 'react';

interface HeroSectionProps {
  onClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onClick }) => {
  return (
    <div className="relative rounded-lg bg-gradient-to-b from-[#001F54] to-blue-800 p-12 text-white shadow-lg">
      <h1 className="mb-6 text-5xl font-extrabold">Get a Quote in Seconds</h1>
      <p className="mb-8 text-lg font-medium">
        Many cleaning companies are waiting to bid on your request and provide the best, most competitive prices. Let us
        simplify the process for you.
      </p>
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer rounded-lg bg-yellow-400 px-6 py-3 font-bold text-[#001F54] transition duration-300 hover:bg-yellow-500"
      >
        Get Started Now
      </button>
    </div>
  );
};

export default HeroSection;

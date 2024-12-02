'use client';

import React from 'react';
import Link from 'next/link';

const HomeIndustry: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 text-center">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-[#001F54] mb-6">
          Serving a Wide Range of Industries
        </h2>

        {/* Blurb */}
        <p className="text-lg text-gray-700 mb-8">
          At JanFinder, we connect customers with top-tier cleaning companies tailored to their specific industry needs. From bustling airports to cozy libraries, we ensure that every facility gets the best service possible.
        </p>

        {/* Link to Industries */}
        <Link
          href="/industries"
          className="bg-yellow-400 text-[#001F54] text-lg font-medium px-6 py-3 rounded shadow-md transition duration-300 hover:bg-[#001F54] hover:text-white"
        >
          See All Industries
        </Link>
      </div>
    </section>
  );
};

export default HomeIndustry;

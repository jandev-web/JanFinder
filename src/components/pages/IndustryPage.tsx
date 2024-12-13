'use client';

import React from 'react';
import Link from 'next/link';

const industries = [
  { name: 'Airports', href: '/industries/airport' },
  { name: 'Auto Dealers', href: '/industries/auto-dealer' },
  { name: 'Banks', href: '/industries/bank' },
  { name: 'Bowling Alleys', href: '/industries/bowling-alley' },
  { name: 'Religious Buildings', href: '/industries/religious-building' },
  { name: 'Libraries', href: '/industries/library' },
  { name: 'Malls', href: '/industries/mall' },
  { name: 'Medical', href: '/industries/medical' },
  { name: 'Movie Theaters', href: '/industries/movie-theater' },
  { name: 'Night Clubs', href: '/industries/night-club' },
  { name: 'Offices', href: '/industries/office' },
  { name: 'Restaurants', href: '/industries/restaurant' },
  { name: 'Retail', href: '/industries/retail' },
  { name: 'TV/ Radio Studio', href: '/industries/studio' },
];

const Industry: React.FC = () => {
  return (
    <section className="bg-gray-100 md:pt-32 py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <h1 className="text-4xl font-bold text-[#001F54] mb-8 text-center">
          Industries We Serve
        </h1>

        {/* Blurb */}
        <p className="text-lg text-gray-700 mb-12 text-center">
          JanFinder specializes in connecting customers with professional cleaning companies across a variety of industries. From airports to offices, we ensure every facility gets the highest standard of cleaning services. Explore the industries we serve and see how we can help you!
        </p>

        {/* Industry List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry) => (
            <Link
              key={industry.name}
              href={industry.href}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center border border-gray-200 hover:border-yellow-400"
            >
              <h2 className="text-xl font-semibold text-[#001F54]">
                {industry.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industry;

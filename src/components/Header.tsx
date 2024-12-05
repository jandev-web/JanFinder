'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HomeHeaderDropdown from './HomeHeaderDropdown';

const dropdownData = {
  industries: {
    title: 'Supported Industries',
    image: '/images/dropdownHand4.png',
    links: [
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
    ],
  },
  customers: {
    title: 'Quote Seekers',
    image: '/images/dropdownCustomer.png',
    links: [
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Our Quote Process', href: '/quote-process' },
      { name: 'Our Bidding Process', href: '/bidding-process' },
      { name: 'Start a Quote Now!', href: '/faq' },
      { name: 'Check Quote Status', href: '/quote-status' },
      { name: 'Quote Seeker Home Page', href: '/quote-seeker' },
    ],
  },
  owners: {
    title: 'Business Owners',
    image: '/images/dropdownOwner.png',
    links: [
      { name: 'Become a Business Owner', href: '/business-owner' },
      { name: 'Franchise Support', href: '/franchise-support' },
    ],
  },
  why: {
    title: 'Why Use JanFinder?',
    image: '/images/dropdownWhy.png',
    links: [
      { name: 'Our Quote Process', href: '/quote-process' },
      { name: 'Our Bidding Process', href: '/bidding-process' },
      { name: 'Reviews', href: '/reviews' },
      { name: 'FAQs', href: '/faq' },
      { name: 'Why use JanFinder', href: '/why-janfinder' },
      { name: 'About Us', href: '/about' },
    ],
  },
};

const Header = () => {


  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleMouseEnter = (type: string) => {
    setActiveDropdown(type);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };


  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-lg">
      <div className="mx-auto flex w-full relative z-20">
        {/* Logo on the Left */}
        <div className="flex-shrink-0 pr-6 pl-6 pt-8 z-20">
          <Link href="/" className="text-[#001F54] font-bold">
            <h1 className="text-5xl">Jan<span className="text-yellow-500">Finder</span></h1>
          </Link>
        </div>

        {/* Navigation and Gradient Bar */}
        <div className="flex flex-col w-full">
          {/* Gradient Bar */}
          <div className="h-10 bg-gradient-to-r from-white to-[#001F54] flex items-center justify-between px-4">
            {/* Placeholder for additional content */}
            <div></div>
            {/* Right side */}
            <div>
              <Link
                href="/login"
                className="text-white text-lg mr-6 font-medium hover:text-yellow-500 transition duration-300"
              >
                Log In
              </Link>
              <Link
                href="/quote-status"
                className="text-white text-lg font-medium hover:text-yellow-500 transition duration-300"
              >
                Check Quote Status
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center justify-center space-x-6  mt-4 pr-6">
            <div className="flex items-center space-x-6">
              <div
                className="flex flex-col items-center px-6 py-4 cursor-pointer text-[#001F54] text-lg font-medium hover:text-yellow-300 transition duration-300 group"
                onMouseEnter={() => handleMouseEnter('industries')}
                onMouseLeave={handleMouseLeave}
              >
                Supported Industries
                <div className="h-[2px] bg-yellow-500 w-full mt-1 transition duration-300 group-hover:bg-[#001F54]"></div>
                {activeDropdown === 'industries' && (
                  <HomeHeaderDropdown title={dropdownData.industries.title} image={dropdownData.industries.image} links={dropdownData.industries.links} />
                )}
              </div>
              <div className="h-8 border-l border-gray-300"></div>
              <div
                className="flex flex-col items-center px-6 py-4 cursor-pointer text-[#001F54] text-lg font-medium hover:text-yellow-300 transition duration-300 group"
                onMouseEnter={() => handleMouseEnter('customers')}
                onMouseLeave={handleMouseLeave}
              >
                Quote Seekers
                <div className="h-[2px] bg-yellow-500 w-full mt-1 transition duration-300 group-hover:bg-[#001F54]"></div>
                {activeDropdown === 'customers' && (
                  <HomeHeaderDropdown title={dropdownData.customers.title} image={dropdownData.customers.image} links={dropdownData.customers.links} />
                )}
              </div>
              <div className="h-8 border-l border-gray-300"></div>
              <div
                className="flex flex-col items-center px-6 py-4 cursor-pointer text-[#001F54] text-lg font-medium hover:text-yellow-300 transition duration-300 group"
                onMouseEnter={() => handleMouseEnter('owners')}
                onMouseLeave={handleMouseLeave}
              >
                Business Owners
                <div className="h-[2px] bg-yellow-500 w-full mt-1 transition duration-300 group-hover:bg-[#001F54]"></div>
                {activeDropdown === 'owners' && (
                  <HomeHeaderDropdown title={dropdownData.owners.title} image={dropdownData.owners.image} links={dropdownData.owners.links} />
                )}
              </div>
              <div className="h-8 border-l border-gray-300"></div>
              <div
                className="flex flex-col items-center px-6 py-4 cursor-pointer text-[#001F54] text-lg font-medium hover:text-yellow-300 transition duration-300 group"
                onMouseEnter={() => handleMouseEnter('why')}
                onMouseLeave={handleMouseLeave}
              >
                Why JanFinder
                <div className="h-[2px] bg-yellow-500 w-full mt-1 transition duration-300 group-hover:bg-[#001F54]"></div>
                {activeDropdown === 'why' && (
                  <HomeHeaderDropdown title={dropdownData.why.title} image={dropdownData.why.image} links={dropdownData.why.links} />
                )}
              </div>
              <div className="h-8 border-l border-gray-300"></div>
              <Link
                href="/get-a-quote"
                className="bg-yellow-400 text-[#001F54] text-lg font-medium px-4 py-2 rounded transition duration-300 hover:bg-[#001F54] hover:text-white"
              >
                Get a Quote Now!
              </Link>
            </div>
          </nav>

        </div>
      </div>
    </header>

  );
};

export default Header;

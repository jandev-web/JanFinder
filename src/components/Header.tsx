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
    title: 'Why Bid2Clean?',
    image: '/images/dropdownWhy.png',
    links: [
      { name: 'Our Quote Process', href: '/quote-process' },
      { name: 'Our Bidding Process', href: '/bidding-process' },
      { name: 'Reviews', href: '/reviews' },
      { name: 'FAQs', href: '/frequently-asked' },
      { name: 'Why use Bid2Clean', href: '/why-bid2clean' },
      { name: 'About Us', href: '/about' },
    ],
  },
};

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleMouseEnter = (type: string) => setActiveDropdown(type);
  const handleMouseLeave = () => setActiveDropdown(null);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo (LandingPage look) */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#001F54] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">B2C</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#001F54] block">Bid2Clean</span>
              <span className="h-1 w-20 bg-yellow-400 rounded-full block" />
            </div>
          </Link>

          {/* Nav (LandingPage layout) + dropdown functionality from Header */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Left set: menu triggers with dropdowns (also anchor to sections on LandingPage) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('industries')}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href="#industries"
                className="text-gray-600 hover:text-[#001F54] font-medium transition-colors"
              >
                Industries
              </a>
              {activeDropdown === 'industries' && (
                <HomeHeaderDropdown
                  title={dropdownData.industries.title}
                  image={dropdownData.industries.image}
                  links={dropdownData.industries.links}
                />
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('owners')}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href="#business-owners"
                className="text-gray-600 hover:text-[#001F54] font-medium transition-colors"
              >
                Business Owners
              </a>
              {activeDropdown === 'owners' && (
                <HomeHeaderDropdown
                  title={dropdownData.owners.title}
                  image={dropdownData.owners.image}
                  links={dropdownData.owners.links}
                />
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('customers')}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href="#quote-seekers"
                className="text-gray-600 hover:text-[#001F54] font-medium transition-colors"
              >
                Quote Seekers
              </a>
              {activeDropdown === 'customers' && (
                <HomeHeaderDropdown
                  title={dropdownData.customers.title}
                  image={dropdownData.customers.image}
                  links={dropdownData.customers.links}
                />
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('why')}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href="#why-bid2clean"
                className="text-gray-600 hover:text-[#001F54] font-medium transition-colors"
              >
                Why Bid2Clean
              </a>
              {activeDropdown === 'why' && (
                <HomeHeaderDropdown
                  title={dropdownData.why.title}
                  image={dropdownData.why.image}
                  links={dropdownData.why.links}
                />
              )}
            </div>

            {/* Utility links from original Header (kept, styled to match) */}
            <Link
              href="/members"
              className="text-gray-600 hover:text-[#001F54] font-medium transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/quote-status"
              className="text-gray-600 hover:text-[#001F54] font-medium transition-colors"
            >
              Check Quote Status
            </Link>

            {/* CTA (LandingPage style) */}
            <Link href="/get-a-quote">
              <button className="bg-[#001F54] text-white hover:bg-yellow-500 font-semibold px-6 py-2 rounded-md transition-colors">
                Get a Quote Now!
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

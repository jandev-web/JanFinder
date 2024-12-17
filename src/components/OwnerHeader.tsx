'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import fetchOwnerById from '@/utils/getOwnerById';

interface OwnerHeaderProps {
  user: any;
}

const OwnerHeader: React.FC<OwnerHeaderProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <div className="text-center text-gray-500 py-4">Loading...</div>;
  } else {
    return (
      <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#001F54] shadow-lg py-6 sticky top-0 z-20 w-full">
        <nav className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo / User Dashboard Link */}
          <div className="text-xl font-extrabold text-[#001F54]">
            <Link href="/members/owner" className="hover:text-blue-800 transition duration-300">
              {user?.firstName}&apos;s Dashboard
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="flex items-center space-x-8">
            <li>
              <Link href="/members/owner/profile" className="text-lg font-medium hover:text-blue-800 transition duration-300">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/members/owner/subscription" className="text-lg font-medium hover:text-blue-800 transition duration-300">
                Manage Subscription
              </Link>
            </li>
            <li>
              <Link href="/members/owner/franchise" className="text-lg font-medium hover:text-blue-800 transition duration-300">
                Franchise
              </Link>
            </li>
            <li>
              <Link href="/members/owner/cbos" className="text-lg font-medium hover:text-blue-800 transition duration-300">
                Manage CBOs
              </Link>
            </li>
            <li>
              <Link href="/members/owner/quotes" className="text-lg font-medium hover:text-blue-800 transition duration-300">
                Manage Quotes
              </Link>
            </li>
            {user && (
              <li>
                <Link href="/members/logging-out" className="text-lg font-medium hover:text-blue-800 transition duration-300">
                  Log Out
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
    );
  }
};

export default OwnerHeader;

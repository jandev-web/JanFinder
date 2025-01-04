'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';

interface OwnerHeaderProps {
  user: any;
}

const OwnerHeader: React.FC<OwnerHeaderProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  console.log(user)
  if (loading) {
    return <div className="text-center text-gray-500 py-4">Loading...</div>;
  } else {


    return (
      <header className="fixed top-0 w-full z-50 bg-white shadow-lg">
        <div className="mx-auto flex w-full relative z-20">
          {/* Logo on the Left */}
          <div className="flex-shrink-0 pr-6 pl-6 pt-8 z-20">
            <Link href="/members/sign-in" className="text-[#001F54] font-bold">
              <h1 className="text-5xl">Jan<span className="text-yellow-500">Member</span></h1>
            </Link>
            <p className='pl-10 italic'>Franchise Owner Area</p>
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
                  href="/logging-out"
                  className="text-white text-lg mr-6 font-medium hover:text-yellow-500 transition duration-300"
                >
                  Log Out
                </Link>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center justify-center space-x-6  mt-4 pr-6">
              <div className="flex items-center space-x-6">
                <Link
                  href="/members/owner"
                  className="flex flex-col items-center px-6 py-4 cursor-pointer text-[#001F54] text-lg font-medium hover:text-yellow-300 transition duration-300 group"

                >
                  Dashboard
                  <div className="h-[2px] bg-yellow-500 w-full mt-1 transition duration-300 group-hover:bg-[#001F54]"></div>

                </Link>
                <div className="h-8 border-l border-gray-300"></div>
                <Link
                  href="members/owner/franchise"
                  className="flex flex-col items-center px-6 py-4 cursor-pointer text-[#001F54] text-lg font-medium hover:text-yellow-300 transition duration-300 group"

                >
                  Franchise
                  <div className="h-[2px] bg-yellow-500 w-full mt-1 transition duration-300 group-hover:bg-[#001F54]"></div>

                </Link>
                <div className="h-8 border-l border-gray-300"></div>
                <Link
                  href="members/owner/cbos"
                  className="flex flex-col items-center px-6 py-4 cursor-pointer text-[#001F54] text-lg font-medium hover:text-yellow-300 transition duration-300 group"

                >
                  Owners
                  <div className="h-[2px] bg-yellow-500 w-full mt-1 transition duration-300 group-hover:bg-[#001F54]"></div>

                </Link>
                <div className="h-8 border-l border-gray-300"></div>
                <Link
                  href="members/owner/subscription"
                  className="flex flex-col items-center px-6 py-4 cursor-pointer text-[#001F54] text-lg font-medium hover:text-yellow-300 transition duration-300 group"

                >
                  Subscriptions
                  <div className="h-[2px] bg-yellow-500 w-full mt-1 transition duration-300 group-hover:bg-[#001F54]"></div>

                </Link>
                <div className="h-8 border-l border-gray-300"></div>
                <Link
                  href="/members/owner/quotes"
                  className="flex flex-col items-center px-6 py-4 cursor-pointer text-[#001F54] text-lg font-medium hover:text-yellow-300 transition duration-300 group"

                >
                  Quotes
                  <div className="h-[2px] bg-yellow-500 w-full mt-1 transition duration-300 group-hover:bg-[#001F54]"></div>

                </Link>
                <div className="h-8 border-l border-gray-300"></div>
                <Link
                  href="/members/owner/profile"
                  className="flex items-center justify-center bg-yellow-400 text-[#001F54] text-lg font-medium px-4 py-2 rounded-full transition duration-300 hover:bg-[#001F54] hover:text-white"
                >
                  <FaUserCircle size={28} />
                  <p className='pl-2'>{user.firstName}</p>
                </Link>
              </div>
            </nav>

          </div>
        </div>
      </header>

    );
  }
};

export default OwnerHeader;

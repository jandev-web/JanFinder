'use client';

import React, { useState } from 'react';
import Link from 'next/link';


const Header = () => {


  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-lg">
      <div className="mx-auto flex w-full relative z-20">
        {/* Logo on the Left */}
        <div className="flex-shrink-0 pr-6 pl-6 pt-4 pb-4  z-20">
          <div className="text-blue-900 font-bold">
            <h1 className="text-5xl">Jan<span className="text-yellow-400">Finder</span></h1>
          </div>
        </div>

        {/* Navigation and Gradient Bar */}
        <div className="flex flex-col w-full">
          {/* Gradient Bar */}
          <div className="h-10 bg-gradient-to-r from-white to-[#001F54] flex items-center justify-between px-4">
            {/* Placeholder for additional content */}
            <div></div>
            {/* Right side */}
      
          </div>
        </div>
      </div>
    </header>

  );
};

export default Header;

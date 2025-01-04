'use client';

import React from 'react';

import Link from 'next/link';


const MemberLandingHeader: React.FC = () => {
  

  return (
    
      <div className="text-[#001F54]">
        <div className="flex bg-white pt-2 text-[#001F54] flex-col items-start">
          <Link href="/" className="text-[#001F54] pl-6 p-2 font-bold">
            <h1 className="text-5xl text-[#001F54]">Jan<span className="text-yellow-500">Finder</span></h1>
          </Link>
          <div className="h-2 bg-gradient-to-r from-yellow-500 to-white w-full mt-2"></div>
        </div>
        </div>

        
      
);


};

export default MemberLandingHeader;


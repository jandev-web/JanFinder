'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const buildingTypes = [
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
];

const IndustryHeaderDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const column1 = buildingTypes.slice(0, Math.ceil(buildingTypes.length / 3));
  const column2 = buildingTypes.slice(
    Math.ceil(buildingTypes.length / 3),
    Math.ceil((2 * buildingTypes.length) / 3)
  );
  const column3 = buildingTypes.slice(Math.ceil((2 * buildingTypes.length) / 3));

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div
      className="relative flex items-center h-10 group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dropdown Trigger */}
      <div className="flex flex-col items-center px-4 py-2 cursor-pointer text-[#001F54] text-lg font-medium hover:text-yellow-300 transition duration-300">
        Industries We Support
        {/* Line Under Trigger */}
        <div className="h-[2px] bg-yellow-500 w-full mt-1 transition duration-300 group-hover:bg-[#001F54]"></div>
      </div>


      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full w-[800px] bg-white border border-yellow-600 shadow-lg z-50 rounded-t">
          {/* Blue Header */}
          <div className="bg-white w-full p-4 rounded-t">
            <h1 className="text-2xl font-bold text-[#001F54] text-left">
              Supported Industries
            </h1>
            <div className="h-[2px] bg-yellow-500 w-[200px] mt-2"></div>
          </div>

          {/* Columns */}
          <div className="flex justify-between p-6">
            {/* Column 1 */}
            <div className="flex flex-col space-y-4">
              {column1.map((type) => (
                <Link
                  key={type.name}
                  href={type.href}
                  className="text-lg text-[#001F54] hover:text-yellow-500 transition duration-300"
                >
                  {type.name}
                </Link>
              ))}
            </div>
            {/* Divider */}
            <div className="w-[1px] bg-gray-300"></div>
            {/* Column 2 */}
            <div className="flex flex-col space-y-4">
              {column2.map((type) => (
                <Link
                  key={type.name}
                  href={type.href}
                  className="text-lg text-[#001F54] hover:text-yellow-500 transition duration-300"
                >
                  {type.name}
                </Link>
              ))}
            </div>
            {/* Divider */}
            <div className="w-[1px] bg-gray-300"></div>
            {/* Column 3 */}
            <div className="flex flex-col space-y-4">
              {column3.map((type) => (
                <Link
                  key={type.name}
                  href={type.href}
                  className="text-lg text-[#001F54] hover:text-yellow-500 transition duration-300"
                >
                  {type.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryHeaderDropdown;

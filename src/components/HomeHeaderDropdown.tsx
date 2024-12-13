'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface DropdownProps {
  title: string;
  image: string;
  links: { name: string; href: string }[];
}

const HomeHeaderDropdown: React.FC<DropdownProps> = ({
  title,
  image,
  links,
}) => {
  // Split links into three columns
  const columnCount = 3;
  const columnLength = Math.ceil(links.length / columnCount);
  const columns = Array.from({ length: columnCount }, (_, i) =>
    links.slice(i * columnLength, (i + 1) * columnLength)
  );

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[1000px] bg-white border border-yellow-600 shadow-lg z-50 rounded-lg">
      {/* Header with Title and Image */}
      <div className="flex items-center bg-white p-8 pb-0 pt-8 border-b border-yellow-600 rounded-t-lg">
        <Image
          src={image}
          alt={title}
          className="w-24 h-24 object-fill mr-6"
        />
        <h1 className="text-3xl font-bold text-[#001F54]">{title}</h1>
      </div>

      {/* Links in Three Columns */}
      <div className="flex justify-between p-8">
        {columns.map((column, index) => (
          <div key={index} className="flex flex-col space-y-6 w-1/3">
            {column.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xl text-[#001F54] hover:text-yellow-500 transition duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeHeaderDropdown;

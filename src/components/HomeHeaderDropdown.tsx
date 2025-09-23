'use client';

import React from 'react';
import Link from 'next/link';

interface DropdownProps {
  title: string;
  links: { name: string; href: string }[];
  /** kept for backward compatibility; not used */
  image?: string;
}

const HomeHeaderDropdown: React.FC<DropdownProps> = ({ title, links }) => {
  // Split links into three balanced columns
  const columnCount = 3;
  const columnLength = Math.ceil(links.length / columnCount);
  const columns = Array.from({ length: columnCount }, (_, i) =>
    links.slice(i * columnLength, (i + 1) * columnLength)
  );

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-full w-[920px] rounded-2xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 overflow-hidden"
      role="menu"
      aria-label={title}
    >
      {/* Title + yellow underline */}
      <div className="px-6 pt-5 pb-4 bg-white text-center">
        <h2 className="text-xl font-semibold text-[#001F54]">{title}</h2>
        <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-[#F5C542]" />
      </div>

      {/* Link grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {columns.map((column, idx) => (
            <ul key={idx} className="space-y-1.5">
              {column.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    role="menuitem"
                    className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-[#001F54] hover:bg-blue-50 transition-colors"
                  >
                    <span className="truncate">{link.name}</span>
                    <svg
                      className="ml-3 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 5l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeHeaderDropdown;

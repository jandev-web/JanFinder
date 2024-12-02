'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const businessOwnerLinks = [
    { label: 'Become a Business Owner', href: '/business-owner' },
    { label: 'Franchise Support', href: '/franchise-support' },
];

const BusinessOwnerHeaderDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                Business Owners
                <div className="h-[2px] bg-yellow-500 w-full mt-1 transition duration-300 group-hover:bg-[#001F54]"></div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full w-fill bg-white border border-yellow-600 shadow-lg z-50 rounded-t">
                    {/* Blue Header */}
                    <div className="bg-white w-full p-4 rounded-t">
                        <h1 className="text-2xl font-bold text-[#001F54] text-left whitespace-nowrap">
                            Business Owners
                        </h1>
                        <div className="h-[2px] bg-yellow-500 w-[200px] mt-2"></div>
                    </div>

                    {/* Centered Links */}
                    <div className="flex flex-col items-center space-y-2 p-4">
                        {businessOwnerLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block text-[#001F54] hover:text-yellow-500 transition duration-300 w-full text-center py-2"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessOwnerHeaderDropdown;

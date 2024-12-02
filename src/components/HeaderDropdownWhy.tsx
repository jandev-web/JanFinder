'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const whyLinks = [
    { name: 'Our Quote Process', href: '/quote-process' },
    { name: 'Our Bidding Process', href: '/bidding-process' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Frequently Asked Questions', href: '/faq' },
    { name: 'Why use JanFinder', href: '/why-janfinder' },
    { name: 'About Us', href: '/about' }
];

const HeaderDropdownWhy: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const column1 = whyLinks.slice(0, Math.ceil(whyLinks.length / 3));
    const column2 = whyLinks.slice(
        Math.ceil(whyLinks.length / 3),
        Math.ceil((2 * whyLinks.length) / 3)
    );
    const column3 = whyLinks.slice(Math.ceil((2 * whyLinks.length) / 3));

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
                Why JanFinder
                {/* Line Under Trigger */}
                <div className="h-[2px] bg-yellow-500 w-full mt-1 transition duration-300 group-hover:bg-[#001F54]"></div>
            </div>


            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full w-[800px] bg-white border border-yellow-600 shadow-lg z-50 rounded-t">
                    {/* Blue Header */}
                    <div className="bg-white w-full p-4 rounded-t">
                        <h1 className="text-2xl font-bold text-[#001F54] text-left">
                            Why Use JanFinder?              </h1>
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

export default HeaderDropdownWhy;

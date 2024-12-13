'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

const SmallHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <header className="fixed absolute top-0 w-full z-50 bg-white shadow-lg">
            {/* Header Top Section */}
            <div className="flex items-center justify-between px-4 py-3">
                {/* Logo */}
                <Link href="/" className="text-[#001F54] font-bold text-3xl">
                    Jan<span className="text-yellow-500">Finder</span>
                </Link>

                {/* Hamburger Menu Icon */}
                <div className="flex items-center">
                    <button
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                        className="text-[#001F54] text-2xl focus:outline-none"
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                    <p className="ml-2 text-sm text-[#001F54]">Menu</p>
                </div>
            </div>

            {/* Dropdown Menu */}
            <nav
                className={`${menuOpen ? 'block' : 'hidden'
                    } bg-white shadow-lg transition-all duration-300 ease-in-out`}
            >
                <ul className="flex flex-col items-center space-y-4 py-4">
                    <li>
                        <Link href="/industries" className="text-[#001F54] text-lg font-medium hover:text-yellow-500 transition duration-300">
                            Supported Industries
                        </Link>
                    </li>
                    <li>
                        <Link href="/quote-seeker" className="text-[#001F54] text-lg font-medium hover:text-yellow-500 transition duration-300">
                            Quote Seekers
                        </Link>
                    </li>
                    <li>
                        <Link href="/business-owner" className="text-[#001F54] text-lg font-medium hover:text-yellow-500 transition duration-300">
                            Business Owners
                        </Link>
                    </li>
                    <li>
                        <Link href="/why-janfinder" className="text-[#001F54] text-lg font-medium hover:text-yellow-500 transition duration-300">
                            Why JanFinder
                        </Link>
                    </li>
                    <li>
                        <Link href="/get-a-quote" className="bg-yellow-400 text-[#001F54] text-lg font-medium px-4 py-2 rounded transition duration-300 hover:bg-[#001F54] hover:text-white">
                            Get a Quote Now!
                        </Link>
                    </li>
                    <li>
                        <Link href="/members/sign-in" className="text-[#001F54] text-lg font-medium hover:text-yellow-500 transition duration-300">
                            Log In
                        </Link>
                    </li>
                    <li>
                        <Link href="/quote-status" className="text-[#001F54] text-lg font-medium hover:text-yellow-500 transition duration-300">
                            Check Quote Status
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default SmallHeader;

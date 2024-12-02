'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBriefcase, FaHandshake } from 'react-icons/fa';

const BusinessOwnerWhy: React.FC = () => {
    return (
        <section className="relative bg-gradient-to-r from-[#001F54] to-[#003a85] text-white py-16">
            {/* Image Section */}
            <div className="relative w-full h-[500px] lg:h-[700px] overflow-hidden">
                <Image
                    src="/images/BusinessOwnerPic.jpeg"
                    alt="Business Owners"
                    layout="fill" // Use appropriate layout (fill, fixed, or responsive)
                    objectFit="cover"
                    priority={true} // Optimize for LCP
                />

                {/* Solid Gray Overlay on Smaller Left Area */}
                <div className="absolute inset-y-0 left-0 w-[35%] bg-black/50"></div>

                {/* Overlay Content */}
                <div className="relative flex h-full items-center justify-between">
                    {/* Left Content */}
                    <div className="max-w-lg z-10 ml-20">
                        <h2 className="text-4xl font-bold mb-6">
                            Why Join <span className="text-yellow-400">JanFinder</span>?
                        </h2>
                        <p className="text-lg leading-relaxed">
                            JanFinder is the ultimate platform for cleaning business owners. With an abundance of opportunities, streamlined tools, and an easy-to-use interface, it&apos;s the ideal place to grow your business.
                        </p>

                    </div>

                    {/* Right Call-to-Action Circle */}
                    <div className="flex items-center justify-center w-[350px] h-[350px] rounded-full bg-[#001F54] border-4 border-yellow-400 shadow-lg mr-60 relative -top-8 -ml-[450px]">
                        <div className="flex flex-col items-center text-center px-6">
                            {/* Icon Above */}
                            <FaBriefcase size={50} className="text-yellow-400 mb-4" />
                            {/* Text */}
                            <p className="text-lg font-medium text-white mb-6">
                                Ready to join thousands of other business owners today? Make the upgrade with JanFinder.
                            </p>
                            {/* Button */}
                            <Link
                                href="/members/sign-up"
                                className="bg-yellow-400 text-[#001F54] text-lg font-medium px-6 py-3 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300 mb-4"
                            >
                                Join Today
                            </Link>
                            {/* Icon Below */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BusinessOwnerWhy;

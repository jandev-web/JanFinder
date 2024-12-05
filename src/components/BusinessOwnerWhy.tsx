'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBriefcase } from 'react-icons/fa';

const BusinessOwnerWhy: React.FC = () => {
    return (
        <section className="relative bg-gradient-to-r from-[#001F54] to-[#003a85] text-white py-16">
            {/* Container for Image and Content */}
            <div className="relative w-full h-auto lg:h-[700px]">
                {/* Image Section */}
                <div className="relative w-full h-[500px] lg:h-full overflow-hidden">
                    <Image
                        src="/images/BusinessOwnerPic.jpeg"
                        alt="Business Owners"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="top"
                        priority
                    />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex justify-between flex-wrap lg:flex-nowrap">
                    {/* Left Section with Gray Background */}
                    <div className="w-full lg:w-[35%] bg-black/50 p-8 lg:p-12 flex items-center">
                        <div className="text-left space-y-6">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white">
                                Why Join <span className="text-yellow-400">JanFinder</span>?
                            </h2>
                            <p className="text-base lg:text-lg leading-relaxed text-white">
                                JanFinder is the ultimate platform for cleaning business owners. With an abundance of opportunities, streamlined tools, and an easy-to-use interface, it&apos;s the ideal place to grow your business.
                            </p>
                        </div>
                    </div>
                    <div className='pl-10'></div>

                    {/* Right Call-to-Action Circle */}
                    <div className="w-full lg:w-auto flex justify-center px-32 lg:justify-end items-center mt-6 lg:mt-0">
                        <div className="w-[300px] h-[300px] lg:w-[350px] lg:h-[350px] rounded-full bg-[#001F54] border-4 border-yellow-400 shadow-lg flex flex-col items-center justify-center text-center px-6">
                            <FaBriefcase size={50} className="text-yellow-400 mb-4" />
                            <p className="text-base lg:text-lg font-medium text-white mb-4">
                                Ready to join thousands of other business owners today? Make the upgrade with JanFinder.
                            </p>
                            <Link
                                href="/members/sign-up"
                                className="bg-yellow-400 text-[#001F54] text-base lg:text-lg font-medium px-6 py-3 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300"
                            >
                                Join Today
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BusinessOwnerWhy;

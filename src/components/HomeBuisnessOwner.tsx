'use client';

import React from 'react';
import Link from 'next/link';
import OwnerHomeIcons from '@/components/OwnerHomeIcons';

const HomeBusinessOwner: React.FC = () => {
    return (
        <section className="bg-gradient-to-r from-[#001F54] to-[#003a85] py-16">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center lg:items-start">
                {/* Left Content */}
                <div className="lg:w-1/2 mb-12 lg:mb-0">
                    <h2 className="text-4xl font-bold text-white mb-8">
                        Empower Your Business with <span className="text-yellow-400">JanFinder</span>
                    </h2>
                    <p className="text-lg text-gray-200 mb-6 leading-relaxed">
                        Grow your cleaning business with a constant stream of competitive quotes from JanFinder. Manage quotes, schedules, and customer communication—all in one place.
                    </p>
                    <p className="text-lg text-gray-200 mb-6 leading-relaxed">
                        Signing up as a business owner on JanFinder is the best move you’ll make to grow your cleaning business. With our streamlined platform, you’ll gain access to a constant stream of competitive quotes, helping you secure more contracts than ever before.
                    </p>
                    <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                        Not only will you see an increase in business, but JanFinder also offers a suite of powerful tools to help you run your business more efficiently. From quote management to scheduling and customer communication, we’re here to simplify your operations so you can focus on what you do best—delivering top-notch cleaning services!
                    </p>

                    {/* Call to Action Section */}
                    <div className="flex flex-col items-start">
                        <Link
                            href="/sign-up"
                            className="bg-yellow-500 text-white text-lg font-medium px-8 py-4 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 mb-4"
                        >
                            Join JanFinder Today!
                        </Link>
                        <Link
                            href="/login"
                            className="text-sm text-gray-300 underline hover:text-gray-100"
                        >
                            Already signed up? Click here to sign in
                        </Link>
                    </div>
                </div>

                {/* Right Content */}
                <div className="lg:w-1/2 flex justify-center">
                    <OwnerHomeIcons />
                </div>
            </div>
        </section>
    );
};

export default HomeBusinessOwner;

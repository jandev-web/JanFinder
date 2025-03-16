'use client';

import React from 'react';
import Link from 'next/link';

const Welcome: React.FC = () => {
    return (
        <section className="bg-gradient-to-r from-[#001F54] to-[#003a85] text-white py-16 z-20">
            <div className="container mx-auto px-6 text-center">
                {/* Main Heading */}
                <h1 className="text-4xl lg:text-5xl font-extrabold mb-2">
                    Welcome to <span className="text-yellow-400">Bid2Clean</span>
                </h1>

                {/* Tagline */}
                <p className="italic text-lg lg:text-xl text-yellow-200 mb-8">
                    &quot;The cleaning quote marketplace where companies compete, and you win!&quot;
                </p>


                {/* Subheading */}
                <p className="text-lg lg:text-xl font-light mb-8 max-w-3xl mx-auto">
                    Your one-stop solution for finding top-notch cleaning services tailored to your facility.
                    Get instant quotes, compare bids, and choose the best cleaning company with ease and confidence.
                </p>

                {/* Call-to-Action */}
                <div className="flex justify-center">
                    <Link
                        href="/get-quote"
                        className="bg-yellow-400 text-[#001F54] text-lg font-medium px-6 py-3 rounded shadow-lg hover:bg-white hover:text-yellow-500 transition duration-300"
                    >
                        Get Your Free Quote Now
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Welcome;

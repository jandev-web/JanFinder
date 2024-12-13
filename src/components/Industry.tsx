'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface IndustryPageProps {
    name: string;
    image: string;
    blurb: string;
}

const IndustryPage: React.FC<IndustryPageProps> = ({ name, image, blurb }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            {/* Industry Image */}
            <div className="mb-8 flex justify-center">
                <Image
                    src={image}
                    alt={`${name} Cleaning Services`}
                    className="w-full max-w-2xl rounded-lg shadow-lg"
                />
            </div>

            {/* Industry Title */}
            <h1 className="text-4xl font-bold text-[#001F54] mb-4 text-center">
                Cleaning Services for {name}
            </h1>

            {/* Blurb */}
            <p className="text-lg text-gray-600 mb-6 text-center">{blurb}</p>

            {/* Links */}
            <div className="flex flex-col md:flex-row md:space-x-6 justify-center">
                <Link
                    href="/get-quote"
                    className="bg-yellow-400 text-[#001F54] text-lg font-medium px-6 py-3 rounded shadow-lg hover:bg-[#001F54] hover:text-white transition duration-300 mb-4 md:mb-0"
                >
                    Get a quote for your {name} building
                </Link>
                <Link
                    href="/sign-up"
                    className="bg-yellow-400 text-[#001F54] text-lg font-medium px-6 py-3 rounded shadow-lg hover:bg-[#001F54] hover:text-white transition duration-300"
                >
                    Sign up your {name} cleaning company today
                </Link>
            </div>
        </div>
    );
};

export default IndustryPage;

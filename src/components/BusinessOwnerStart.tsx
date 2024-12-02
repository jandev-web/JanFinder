'use client';

import React from 'react';
import Link from 'next/link';

const BusinessOwnerStart: React.FC = () => {
    return (
        <section className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-blue-900 mb-6">
                    Ready to Get Started?
                </h2>
                <p className="text-lg text-blue-800 mb-8 leading-relaxed">
                    JanFinder offers everything you need to grow your business, secure more jobs, and simplify your operations. Sign up today and join a thriving network of cleaning professionals!
                </p>
                <Link
                    href="/sign-up"
                    className="bg-blue-900 text-white text-lg font-medium px-8 py-4 rounded-lg shadow-md hover:bg-blue-800 transition duration-300"
                >
                    Start Today!
                </Link>
            </div>
        </section>
    );
};

export default BusinessOwnerStart;

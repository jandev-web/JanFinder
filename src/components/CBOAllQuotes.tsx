'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingScreenPhrase';



const AllQuotes: React.FC = () => {
    
    const router = useRouter();

    
    return (
        <div className="flex flex-col items-center gap-8 py-10">


            {/* Accepted Quotes Section */}
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold text-[#001F54]">Purchased Contracts</h2>
                <p className="text-sm text-gray-700 text-center mt-1">
                    Go to the contracts that you have purchased.
                </p>
                <button
                    className="mt-4 w-56 py-2 bg-yellow-500 text-[#001F54] font-semibold rounded-lg hover:bg-yellow-400 transition"
                    onClick={() => router.push('/members/cbo/quotes/accepted')}
                >
                    Purchased Contracts
                </button>
            </div>

            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold text-[#001F54]">Available Contracts</h2>
                <p className="text-sm text-gray-700 text-center mt-1">
                    Review the contracts that are available to buy.
                </p>
                <button
                    className="mt-4 w-56 py-2 bg-yellow-500 text-[#001F54] font-semibold rounded-lg hover:bg-yellow-400 transition"
                    onClick={() => router.push('/members/cbo/quotes/available')}
                >
                    Available Contracts
                </button>
            </div>
        </div>

    );
};

export default AllQuotes;

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface RestrictedQuoteProps {
    memberStatus: any;
}

const RestrictedQuote: React.FC<RestrictedQuoteProps> = ({ memberStatus }) => {
    const router = useRouter();

    const handleReturnToQuotes = (memberStatus: any) => {
        if (memberStatus === 'owner') {
            router.push('/members/owner/quotes');
        }
        if (memberStatus === 'cbo') {
            router.push('/members/cbo/quotes');
        }
        
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-center p-10">
            <h1 className="text-4xl font-bold text-red-600 mb-6">Unauthorized Access</h1>
            <p className="text-lg text-gray-700 mb-4">You are not authorized to view this quote.</p>
            <button
                onClick={handleReturnToQuotes}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
            >
                Return to Quotes
            </button>
        </div>
    );
};

export default RestrictedQuote;

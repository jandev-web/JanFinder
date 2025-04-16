// @/components/CallToAction.tsx
'use client';

import React from 'react';
import { startQuote } from '@/utils/startQuote';
import { useRouter } from 'next/navigation';

interface CallToActionProps {
    onLoading: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onLoading }) => {
    const router = useRouter();

    const startNewQuote = async () => {
        onLoading();
        const result = await startQuote();
        console.log(result.quoteID)
        sessionStorage.setItem('customerData', result.quoteID);
        router.push('/get-a-quote/start');
    };

    return (
        <div className="bg-yellow-400 py-12 px-8 text-center rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-[#001F54] mb-4">
                Ready to Get Started?
            </h2>
            <p className="text-lg font-medium text-[#001F54] mb-6">
                Join hundreds of satisfied customers who have found their perfect cleaning service through Bid2Clean.
            </p>
            <button
                onClick={startNewQuote}
                className="bg-[#001F54] hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                Start Your Quote Now

            </button>
        </div>
    );
};

export default CallToAction;

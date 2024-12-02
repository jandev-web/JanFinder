'use client';

import React from 'react';

const customerReviews = [
    {
        text: "JanFinder made getting a cleaning quote so fast and simple! I had bids from top companies within hours. Couldn't be happier!",
        author: "-Patti, Westchester, NY",
    },
    {
        text: "I loved how I could compare quotes without any hassle. Found the perfect cleaning service for our facility in just a day!",
        author: "-John, Austin, TX",
    },
    {
        text: "The process was smooth, quick, and incredibly user-friendly. Highly recommend JanFinder to anyone!",
        author: "-Maria, Miami, FL",
    },
];

const TopCustomerReviews: React.FC = () => {
    return (
        <div className="bg-white p-8 shadow-lg rounded-lg">
            <h3 className="text-2xl font-semibold text-[#001F54] mb-6">What Customers Are Saying</h3>
            <div className="space-y-6">
                {customerReviews.map((review, index) => (
                    <div key={index} className="border-l-4 border-yellow-400 pl-4">
                        <p className="text-gray-700 italic mb-2">&quot;{review.text}&quot;</p>
                        <p className="text-sm font-medium text-gray-500">{review.author}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopCustomerReviews;

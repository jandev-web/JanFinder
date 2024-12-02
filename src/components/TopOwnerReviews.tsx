'use client';

import React from 'react';

const ownerReviews = [
    {
        text: "JanFinder has brought in more quote opportunities than any other platform. It's been a game-changer for our business!",
        author: "-Robbie, Crystal Cleaners",
    },
    {
        text: "I love how I can see real-time bids and compete for jobs that fit our expertise. JanFinder is a fantastic tool!",
        author: "-Sandra, Elite Shine Services",
    },
    {
        text: "Since joining JanFinder, our bookings have skyrocketed. The platform is intuitive and packed with opportunities!",
        author: "-James, SparklePro Cleaning",
    },
];

const TopOwnerReviews: React.FC = () => {
    return (
        <div className="bg-white p-8 shadow-lg rounded-lg">
            <h3 className="text-2xl font-semibold text-[#001F54] mb-6">What Business Owners Are Saying</h3>
            <div className="space-y-6">
                {ownerReviews.map((review, index) => (
                    <div key={index} className="border-l-4 border-yellow-400 pl-4">
                        <p className="text-gray-700 italic mb-2">&quot;{review.text}&quot;</p>
                        <p className="text-sm font-medium text-gray-500">{review.author}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopOwnerReviews;

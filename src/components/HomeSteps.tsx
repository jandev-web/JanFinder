'use client';

import React from 'react';
import { FaClipboardList, FaDollarSign, FaHandshake } from 'react-icons/fa';

const steps = [
    {
        number: 1,
        icon: <FaClipboardList size={40} className="text-yellow-500" />,
        title: 'Enter Your Facility Info',
        description: 'Provide details about your facility such as size, type, and specific cleaning needs.',
    },
    {
        number: 2,
        icon: <FaDollarSign size={40} className="text-yellow-500" />,
        title: 'Receive Your Quote',
        description: 'Get an instant cleaning estimate tailored to your facility requirements.',
    },
    {
        number: 3,
        icon: <FaHandshake size={40} className="text-yellow-500" />,
        title: 'Get Competitive Bids',
        description: 'Watch as companies bid on your project, ensuring you get the best deal.',
    },
];

const HomeSteps: React.FC = () => {
    return (
        <div className="bg-white py-16">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <h2 className="text-3xl font-bold text-[#001F54] text-center mb-12">
                    Get Your Free Quote Today!
                </h2>

                {/* Steps */}
                <div className="flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0 lg:space-x-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center p-6 shadow-lg rounded-lg bg-gray-50 hover:shadow-xl transition duration-300"
                        >
                            {/* Step Number */}
                            <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-blue-800 text-white font-bold text-lg">
                                {step.number}
                            </div>

                            {/* Icon */}
                            <div className="mb-4">{step.icon}</div>

                            {/* Title */}
                            <h3 className="text-xl font-semibold text-[#001F54] mb-2">{step.title}</h3>

                            {/* Description */}
                            <p className="text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeSteps;

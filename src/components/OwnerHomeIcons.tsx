'use client';

import React from 'react';
import { FaPhone, FaArrowRight, FaLaptop, FaBroom } from 'react-icons/fa';

const OwnerHomeIcons: React.FC = () => {
    return (
        <div className="relative w-full lg:w-[500px] h-[500px] lg:h-[500px] flex-shrink-0 rounded-full overflow-hidden shadow-lg">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/businessOwnerHome.jpeg')" }}
            ></div>

            {/* Icons Overlay */}
            <div className="absolute inset-0 flex items-center justify-center space-x-8 bg-black bg-opacity-50">
                {/* Phone Icon */}
                <div className="flex flex-col items-center z-10 text-yellow-400">
                    <FaPhone size={50} className="mb-2" />
                    <span className="text-lg text-white font-medium">Customer</span>
                </div>

                {/* Arrow */}
                <FaArrowRight size={30} className="z-10 text-blue-700" />

                {/* Computer Icon */}
                <div className="flex flex-col items-center z-10 text-yellow-400">
                    <FaLaptop size={50} className="mb-2" />
                    <span className="text-lg text-white font-medium">Quote</span>
                </div>

                {/* Arrow */}
                <FaArrowRight size={30} className="z-10 text-blue-700" />

                {/* Bucket and Mop Icon */}
                <div className="flex flex-col items-center z-10 text-yellow-400">
                    <FaBroom size={50} className="mb-2" />
                    <span className="text-lg text-white font-medium">Job</span>
                </div>
            </div>
        </div>
    );
};

export default OwnerHomeIcons;

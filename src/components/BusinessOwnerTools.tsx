'use client';

import React from 'react';
import { FaTools, FaCalendarAlt, FaEnvelope, FaUsers } from 'react-icons/fa';

const tools = [
    { icon: <FaTools />, title: 'Bidding Platform', description: 'Easily bid on quotes and secure more jobs.' },
    { icon: <FaCalendarAlt />, title: 'Calendar & Scheduling', description: 'Organize and schedule your jobs effortlessly.' },
    { icon: <FaEnvelope />, title: 'Automated Emails', description: 'Stay connected with automated client communication.' },
    { icon: <FaUsers />, title: 'Employee Management', description: 'Manage your team and streamline your operations.' },
];

const BusinessOwnerTools: React.FC = () => {
    return (
        <section className="bg-white py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-[#001F54] text-center mb-12">
                    Powerful Tools for Business Owners
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {tools.map((tool, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 bg-gray-50"
                        >
                            <div className="text-yellow-400 text-4xl mb-4">{tool.icon}</div>
                            <h3 className="text-xl font-semibold text-[#001F54] mb-2">{tool.title}</h3>
                            <p className="text-gray-600">{tool.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BusinessOwnerTools;

'use client';

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Task {
    taskName: string;
    taskFrequency: string;
}

interface Room {
    roomName: string;
    tasks: Task[];
}

interface PackageOption {
    name: string;
    rooms: Room[];
    description: string;
}

interface PackageProps {
    pkg: any;
    cost: number;
    rec: boolean;
    chosen: boolean;
    handleSelect: () => void;
}

const Gold: React.FC<PackageProps> = ({ pkg, rec, chosen, handleSelect, cost }) => {

    const iconSrc = '/images/building_icon.png'

    const bulletPoints = [
        'Comprehensive deep clean of all rooms, including baseboards and corners',
        'Dusting & vacuuming, including hard-to-reach areas',
        'Trash removal and waste bin sanitization',
        'Window cleaning (interior and exterior, with screens)'
    ];

    return (
        <div className={`min-w-[240px] relative overflow-hidden max-w-xs bg-white rounded-t-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 ${rec ? 'border-t-4 border-l-4 border-r-4 border-[#001F54]' : ''} flex flex-col justify-between`}>
            <div>
                {rec && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#001F54] text-white text-sm font-bold px-3 py-1 pt-4 rounded-full shadow-md">
                        Recommended
                    </div>
                )}
                {/* Icon */}
                <img
                    src={iconSrc}
                    alt={`${pkg.name} icon`}
                    className="mx-auto h-16 w-16 mb-4"
                />

                {/* Name */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.name}</h3>

                {/* Cost */}
                <p className="text-3xl font-bold text-gray-900 mb-4">
                    ${cost.toFixed(2)}
                </p>

                {/* Bullet Points */}
                <ul className="mb-6 space-y-2 flex-grow flex-shrink-0">
                    {bulletPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start text-gray-600 text-sm">
                            <span className="mr-2 mt-1">•</span>
                            <span>{point}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='flex-shrink-0'>
                {/* Select Button */}
                {chosen ? (
                    <p className="font-medium text-[#001F54] py2">Selected!</p>
                ) : (
                    <button
                        onClick={handleSelect}
                        className="w-full bg-[#001F54] text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex-shrink-0"
                    >
                        Select {pkg.name}
                    </button>
                )}



            </div>


        </div>
    );
};

export default Gold;

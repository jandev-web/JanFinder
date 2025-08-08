'use client';

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface PackageProps {
    quotePackage: any;
    recPackage: any;
    type: any;
    handleSelect: (pkg: any) => void;
}

const GoldRec: React.FC<PackageProps> = ({ quotePackage, recPackage, type, handleSelect }) => {

    const iconSrc = '/images/building_icon.png'

    const bulletPoints = [
        'Comprehensive deep clean of all rooms, including baseboards and corners',
        'Dusting & vacuuming, including hard-to-reach areas',
        'Trash removal and waste bin sanitization',
        'Window cleaning (interior and exterior, with screens)'
    ];
    const pkg = type === 'chosen' ? quotePackage : type === 'rec' ? recPackage : null;
    const cost = pkg.packageCost;
    const rec = type === 'rec';
    const chosen = type === 'chosen';

    return (
        <div>
            <div className={`min-w-[240px] relative overflow-hidden max-w-xs bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 ${rec ? 'border-4 border-[#001F54]' : ''} flex flex-col justify-between`}>
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.packageName}</h3>

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
                <div className={`min-w-[240px] relative overflow-hidden max-w-xs px-6 pb-6 text-center flex flex-col justify-between`}>
                    <div className="">
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="text-[#001F54] font-bold">See All Services</Typography>
                            </AccordionSummary>
                            <AccordionDetails className="space-y-6">
                                {/* ROOM TASKS */}
                                {pkg?.rooms.map((room: any, index: number) => (
                                    <div key={index} className="border-b border-[#001F54] pb-4">
                                        <div className="flex flex-col items-start">
                                            <h4 className="text-xl font-semibold text-[#001F54] mb-2 text-left">
                                                {room.roomName}
                                            </h4>
                                            <ul className="space-y-2 w-full">
                                                {room.roomTasks.map((task: any, idx: number) => (
                                                    <li key={idx} className="text-sm text-gray-700 flex justify-between items-center border-b border-gray-200 pt-2 pb-1">
                                                        <span className="font-medium flex-grow text-left">{task.taskName}</span>
                                                        <span className="italic text-gray-500 whitespace-nowrap text-right">{task.frequency}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}

                                {/* CARPET TASKS */}
                                {pkg?.carpet?.tasks?.length > 0 && (
                                    <div className="border-t border-[#001F54] pt-4">
                                        <h4 className="text-xl font-semibold text-[#001F54] mb-2 text-left">Carpeted Areas</h4>
                                        <ul className="space-y-2 w-full">
                                            {pkg.carpet.tasks.map((task: any, idx: number) => (
                                                <li key={idx} className="text-sm text-gray-700 flex justify-between items-center border-b border-gray-200 pt-2 pb-1">
                                                    <span className="font-medium flex-grow text-left">{task.taskName}</span>
                                                    <span className="italic text-gray-500 whitespace-nowrap text-right">{task.frequency}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* HARDFLOOR TASKS */}
                                {pkg?.hardfloor?.tasks?.length > 0 && (
                                    <div className="border-t border-[#001F54] pt-4">
                                        <h4 className="text-xl font-semibold text-[#001F54] mb-2 text-left">Hardfloor Areas</h4>
                                        <ul className="space-y-2 w-full">
                                            {pkg.hardfloor.tasks.map((task: any, idx: number) => (
                                                <li key={idx} className="text-sm text-gray-700 flex justify-between items-center border-b border-gray-200 pt-2 pb-1">
                                                    <span className="font-medium flex-grow text-left">{task.taskName}</span>
                                                    <span className="italic text-gray-500 whitespace-nowrap text-right">{task.frequency}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </AccordionDetails>

                        </Accordion>
                    </div>
                </div>

                <div className='flex-shrink-0'>
                    {/* Select Button */}
                    {chosen ? (
                        <p className="font-medium text-[#001F54] py2">Selected!</p>
                    ) : (
                        <button
                            onClick={() => handleSelect(pkg)}
                            className="w-full bg-yellow-400 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex-shrink-0"
                        >
                            Select {pkg.name}
                        </button>
                    )}
                </div>


            </div>
        </div>

    );
};

export default GoldRec;

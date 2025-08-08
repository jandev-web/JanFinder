import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface PackageProps {
    pkg: any;
    recPackage: any;
}

const SilverServiceList: React.FC<PackageProps> = ({ pkg, recPackage }) => {
    const rec = pkg.packageType === recPackage.packageType ? true : false;

    return (
        <div className={`min-w-[240px] relative overflow-hidden max-w-xs bg-white rounded-b-2xl shadow-lg px-6 pb-6 text-center hover:shadow-xl transition-shadow duration-300 ${rec ? 'border-b-4 border-l-4 border-r-4 border-green-700' : ''} flex flex-col justify-between`}>
            <div className="">
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className="text-[#001F54] font-bold">See All Services</Typography>
                    </AccordionSummary>
                    <AccordionDetails className="space-y-6">
                        {/* ROOM TASKS */}
                        {pkg?.rooms?.map((room: any, index: number) => (
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
    );
};

export default SilverServiceList;

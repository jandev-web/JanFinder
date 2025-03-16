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
    pkg: PackageOption | null;
    cost: any;
    rec: boolean;
    handleSelect: () => void;
}

const Gold: React.FC<PackageProps> = ({ pkg, rec, handleSelect, cost }) => {
    return (
        <div className="overflow-hidden  w-full max-w-3xl mx-auto">
            {/* Top Section */}
            <div
                className={`relative text-center p-6 rounded-lg ${
                    rec ? 'border-4 border-green-500' : ''
                }`}
                style={{
                    backgroundImage: `url('/backgrounds/gold.jpeg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Recommended Badge */}
                {rec && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-sm font-bold px-3 py-1 pt-4 rounded-full shadow-md">
                        Recommended
                    </div>
                )}

                {/* Package Name */}
                <h3
                    className="text-3xl text-yellow-100 font-bold mb-4"
                    style={{ // Bright green text
                        textShadow: '0 0 8px #FFD700, 0 0 16px #FFC700, 0 0 24px #FFB700, 0 0 32px #FFA700',
                        // Glowing yellow outline
                    }}
                >
                    {pkg?.name}
                </h3>

                {/* Package Blurb */}
                <div className="p-4 mb-4 inline-block">
                    <Typography
                        className="text-yellow-100"
                        style={{
                            textShadow: '0 0 8px #FFD700, 0 0 16px #FFC700, 0 0 24px #FFB700, 0 0 32px #FFA700',
                        }}
                    >
                        {pkg?.description}
                    </Typography>
                </div>

                {/* Cost */}
                <div className= "text-xl font-semibold border-2 border-yellow-200 rounded-lg p-4 shadow-md inline-block">
                    <Typography
                        className="text-white"
                        style={{
                            textShadow: '0 0 8px #FFD700, 0 0 16px #FFC700, 0 0 24px #FFB700, 0 0 32px #FFA700', // Glowing yellow outline
                        }}
                    >
                        ${cost.toFixed(2)}
                    </Typography>
                </div>
            </div>

            {/* Accordion Section */}
            <div className="bg-white rounded-lg p-4 mt-4 shadow-md">
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className="text-green-700 font-bold">See All Services</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {pkg?.rooms.map((room, index) => (
                            <div key={index} className="border-b border-gray-300 pb-4">
                                <h4 className="text-xl font-semibold text-[#001F54] mb-2">{room.roomName}</h4>
                                <ul className="pl-4 space-y-2">
                                    {room.tasks.map((task, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 flex justify-between items-center">
                                            <span className="font-medium">{task.taskName}</span>
                                            <span className="italic text-gray-500">{task.taskFrequency}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </AccordionDetails>
                </Accordion>
            </div>

            {/* Select Button */}
            <div className="flex justify-center p-6">
                <button
                    onClick={handleSelect}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                >
                    Select {pkg?.name}
                </button>
            </div>
        </div>
    );
};

export default Gold;

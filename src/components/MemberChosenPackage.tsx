'use client';

import React from 'react';

interface Task {
    taskName: string;
    taskFrequency: string;
}

interface Room {
    roomName: string;
    tasks: Task[];
}

interface ChosenPackage {
    name: string;
    rooms: Room[];
}

interface MemberChosenPackageCardProps {
    chosenPackage: ChosenPackage;
}

const MemberChosenPackageCard: React.FC<MemberChosenPackageCardProps> = ({ chosenPackage }) => {
    return (
        <div className="border-2 border-yellow-500 rounded-xl p-6 shadow-lg bg-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#001F54] mb-6 text-center">{chosenPackage.name}</h3>
            <div className="space-y-6">
                {chosenPackage.rooms.map((room, index) => (
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
            </div>
        </div>
    );
};

export default MemberChosenPackageCard;

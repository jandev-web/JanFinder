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

interface SinglePackage {
    name: string;
    rooms: Room[];
}

interface MemberPackageCardProps {
    singlePackage: SinglePackage;
    onSelect: (selectedPackage: SinglePackage) => void;
    isSelected: boolean;
    quoteID: any; // ID of the quote
}

const MemberPackageCard: React.FC<MemberPackageCardProps> = ({
    singlePackage,
    onSelect,
    isSelected,
    quoteID,
}) => {
    return (
        <div
            className={`border-2 rounded-xl p-6 shadow-lg transition ${
                isSelected ? 'border-green-500 bg-green-100' : 'border-gray-200 bg-white hover:border-yellow-400'
            }`}
        >
            <h3 className="text-xl font-bold text-[#001F54] mb-4">{singlePackage.name}</h3>
            <div className="space-y-4">
                {singlePackage.rooms.map((room, index) => (
                    <div key={index}>
                        <h4 className="text-lg font-semibold text-[#001F54]">{room.roomName}</h4>
                        <ul className="pl-4 space-y-2">
                            {room.tasks.map((task, idx) => (
                                <li key={idx} className="text-sm text-gray-700">
                                    <span className="font-medium">{task.taskName}</span> -{' '}
                                    <span className="italic text-gray-500">{task.taskFrequency}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-6 text-center">
                <button
                    onClick={() => onSelect(singlePackage)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-400 transition"
                >
                    Choose Package
                </button>
            </div>
            {isSelected && (
                <p className="mt-4 text-center text-sm font-medium text-green-600">Selected</p>
            )}
        </div>
    );
};

export default MemberPackageCard;

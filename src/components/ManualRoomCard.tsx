'use client';
import React from 'react';

interface ManualRoomCardProps {
    room: any; 
}

const ManualRoomCard: React.FC<ManualRoomCardProps> = ({ room }) => {
    // Extract the room name and sqft from the object

    let roomName = room.type;
    const sqft = room.sqft;

    // Remove the last letter if it ends with 's'
    if (roomName.endsWith('s')) {
        roomName = roomName.slice(0, -1);
    }

    return (
        <div className="bg-[#001F54] text-white p-6 rounded-lg shadow-lg border-2 border-yellow-500 max-w-sm mx-auto my-4">
            <h3 className="text-2xl font-bold text-yellow-500">{roomName}</h3>
            <p className="text-lg mt-2">
                <span className="font-semibold text-yellow-500">Square Footage: </span>
                {sqft} sqft
            </p>
        </div>
    );
};

export default ManualRoomCard;

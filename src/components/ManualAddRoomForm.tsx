'use client';
import React, { useState } from 'react';
import { manualAddRoom } from '@/utils/manualAddRoom'

interface ManualAddRoomFormProps {
    quoteID: string;
    facilityRooms: string[];
}

const ManualAddRoomForm: React.FC<ManualAddRoomFormProps> = ({ quoteID, facilityRooms }) => {
    const [roomType, setRoomType] = useState('');
    const [sqft, setSqft] = useState<number>(0);

    const handleSqftChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        if (!isNaN(value) && value >= 0) {
            setSqft(value);
        }
    };

    const handleRoomTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRoomType(event.target.value);
    };

    const handleAddRoom = () => {
        if (roomType && sqft > 0) {
            const newRoom = { type: roomType, sqft };
        
            console.log('Room Added:', newRoom);
            manualAddRoom(quoteID, newRoom)
        } else {
            alert('Please select a valid room and enter a positive sqft value.');
        }
    };

    return (
        <div className="bg-[#001F54] text-white p-10 rounded-lg shadow-xl max-w-lg mx-auto border-2 border-yellow-500">
            

            {/* Room Selection Dropdown */}
            <label className="block text-yellow-500 font-semibold mb-2">Select Room Type</label>
            <select
                value={roomType}
                onChange={handleRoomTypeChange}
                className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
            >
                <option value="" disabled>Select a room</option>
                {facilityRooms.map((room, index) => (
                    <option key={index} value={room}>{room}</option>
                ))}
            </select>

            {/* Square Footage Input */}
            <label className="block text-yellow-500 font-semibold mb-2">Square Footage</label>
            <input
                type="number"
                value={sqft}
                onChange={handleSqftChange}
                className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
            />

            {/* Add Room Button */}
            <button
                onClick={handleAddRoom}
                className="w-full py-2 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-all"
            >
                Add Room
            </button>
        </div>
    );
};

export default ManualAddRoomForm;

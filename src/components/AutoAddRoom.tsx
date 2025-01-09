'use client';
import React, { useState } from 'react';
import { calculateRoomSqft } from "@/utils/calculateRoomSqft";
import { updateRoomInfo } from '@/utils/memberUpdateRooms';

interface Room {
    name: string;
    percent: number;
}

interface AutoAddRoomProps {
    quoteID: string;
    facilityPercents: { [key: string]: number };
}

const AutoAddRoom: React.FC<AutoAddRoomProps> = ({ quoteID, facilityPercents }) => {
    const [sqft, setSqft] = useState<number>(0);
    const [roomData, setRoomData] = useState<Room[]>(
        Object.entries(facilityPercents).map(([name, percent]) => ({
            name,
            percent,
        }))
    );
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handlePercentChange = (index: number, value: number) => {
        if (value < 0) return; // Prevent negative values
        const updatedRooms = [...roomData];
        updatedRooms[index].percent = value;
        setRoomData(updatedRooms);
    };

    const handleSqftChange = (value: number) => {
        if (value < 0) return; // Prevent negative values
        setSqft(value);
    };

    const calculateTotalPercent = () => {
        return roomData.reduce((sum, room) => sum + room.percent, 0);
    };

    const handleConfirm = async () => {
        const totalPercent = calculateTotalPercent();

        if (totalPercent !== 100) {
            setErrorMessage('The total percentage must equal 100%.');
            return;
        }

        try {
            const finalRooms = await calculateRoomSqft(sqft, roomData);
            console.log("Final Room Calculations:", finalRooms);
            await updateRoomInfo(quoteID, finalRooms, sqft);
            setErrorMessage('');
            alert('Room data successfully updated!');
        } catch (error) {
            console.error('Error updating rooms:', error);
            setErrorMessage('Failed to update rooms. Please try again.');
        }
    };

    return (
        <div className="bg-[#001F54] text-white p-10 rounded-lg shadow-xl max-w-lg mx-auto border-2 border-yellow-500">
            <h2 className="text-3xl font-extrabold mb-6 text-yellow-500 text-center">Auto Add Rooms</h2>

            {/* Square Footage Input */}
            <label className="block text-yellow-500 font-semibold mb-2">Total Square Footage</label>
            <input
                type="number"
                value={sqft}
                onChange={(e) => handleSqftChange(parseFloat(e.target.value))}
                className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
            />

            {/* Total Percentage Display */}
            <p className={`font-bold mb-4 ${calculateTotalPercent() === 100 ? 'text-green-500' : 'text-red-500'}`}>
                Total Percentage: {calculateTotalPercent()}%
            </p>

            {/* Rooms List with Editable Percentages */}
            {roomData.map((room, index) => (
                <div key={index} className="flex items-center justify-between mb-4">
                    <label className="text-yellow-500 font-semibold">{room.name}</label>
                    <input
                        type="number"
                        value={room.percent}
                        min="0"
                        onChange={(e) => handlePercentChange(index, parseFloat(e.target.value))}
                        className="w-16 p-2 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center"
                    />
                </div>
            ))}

            {/* Error Message */}
            {errorMessage && (
                <p className="text-red-500 font-semibold mb-4">{errorMessage}</p>
            )}

            {/* Confirm Button */}
            <button
                onClick={handleConfirm}
                disabled={calculateTotalPercent() !== 100}
                className={`w-full py-2 ${calculateTotalPercent() === 100 ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-gray-500'} text-[#001F54] font-bold rounded-lg transition-all`}
            >
                Confirm
            </button>
        </div>
    );
};

export default AutoAddRoom;

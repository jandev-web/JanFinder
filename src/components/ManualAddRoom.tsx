'use client';

import React, { useState, useEffect } from 'react';
import getQuoteDetails from '@/utils/getQuoteDetails';
import ManualAddRoomForm from './ManualAddRoomForm';
import ManualRoomCard from './ManualRoomCard';

interface ManualAddRoomsProps {
    quoteID: string;
    currentRooms: { [key: string]: number }[];
    facilityRooms: string[];
}

const ManualAddRooms: React.FC<ManualAddRoomsProps> = ({ quoteID, currentRooms, facilityRooms }) => {
    const [rooms, setRooms] = useState<{ [key: string]: number }[]>(currentRooms);
    const [isAddingRoom, setIsAddingRoom] = useState(false); // Controls the visibility of the form

    useEffect(() => {
        const fetchQuoteDetails = async () => {
            try {
                const details = await getQuoteDetails(quoteID);
                const quoteInfo = details.quoteInfo;
                setRooms(quoteInfo?.selectedRooms || []);
            } catch (error) {
                console.error('Error fetching quote details:', error);
            }
        };
        fetchQuoteDetails();
    }, [quoteID]);

    const handleAddRoom = (roomType: string, sqft: number) => {
        const newRoom = { [roomType]: sqft };
        setRooms((prevRooms) => [...prevRooms, newRoom]);
        setIsAddingRoom(false);
    };

    return (
        <div className="bg-[#001F54] text-white p-10 rounded-lg shadow-xl max-w-lg mx-auto border-2 border-yellow-500">
            <h2 className="text-3xl font-extrabold mb-6 text-yellow-500 text-center">Manual Add Rooms</h2>

            {/* List of Rooms */}
            <div className="mb-6 space-y-4">
                {rooms.length > 0 ? (
                    rooms.map((room, index) => (
                        <ManualRoomCard key={index} room={room} />
                    ))
                ) : (
                    <p className="text-center text-yellow-500">No rooms added yet.</p>
                )}
            </div>

            {/* Add Room Button */}
            <button
                onClick={() => setIsAddingRoom(true)}
                className="w-full py-2 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-all"
            >
                Add Room
            </button>

            {/* Manual Add Room Form */}
            {isAddingRoom && (
                <ManualAddRoomForm
                    quoteID={quoteID}
                    facilityRooms={facilityRooms}
                />
            )}
        </div>
    );
};

export default ManualAddRooms;

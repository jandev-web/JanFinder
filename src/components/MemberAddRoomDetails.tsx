// RoomDetails.tsx
import React, { useState, useEffect } from 'react';
import MemberAddRoomCard from '@/components/MemberAddRoomCard';
import MemberRoomDetailsCard from '@/components/MemberRoomDetailCard';

interface Room {
    roomName: string;
    sqft: string;
    floorType: string;
    difficulty: string;
}

interface RoomDetailsProps {
    onRoomChange: (index: number, field: keyof Room, value: string) => void;
    basicRooms: string[];
    rooms: Room[];
    measureType: string;
    onAddRoom: (newRoom: Room) => void;
    onDeleteRoom: (index: number) => void;
}

const RoomDetails: React.FC<RoomDetailsProps> = ({ basicRooms, rooms, onRoomChange, measureType, onAddRoom, onDeleteRoom }) => {
    const [isAddingRoom, setIsAddingRoom] = useState(false);
    const [newRoom, setNewRoom] = useState<Room>({
        roomName: basicRooms[0] || '',
        sqft: '0',
        floorType: '',
        difficulty: ''
    });

    const handleAddRoomClick = () => {
        setIsAddingRoom(true);
    };

    const handleAddRoomConfirm = () => {
        onAddRoom(newRoom);
        setIsAddingRoom(false);
        setNewRoom({ roomName: basicRooms[0] || '', sqft: '0', floorType: '', difficulty: '' });
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-green-600 mb-6">Room Details</h2>

            {rooms.length === 0 && (
                <p className="text-center text-gray-500">No rooms selected.</p>
            )}

            <ul className="space-y-4">
                {rooms.map((room, index) => (
                    <MemberRoomDetailsCard
                        key={index}
                        room={room}
                        index={index}
                        onRoomChange = {onRoomChange}
                        onDeleteRoom={() => onDeleteRoom(index)} 
                    />
                ))}

                {isAddingRoom && (
                    <MemberAddRoomCard
                        basicRooms={basicRooms}
                        newRoom={newRoom}
                        setNewRoom={setNewRoom}
                        onAddRoomConfirm={handleAddRoomConfirm}
                    />
                )}
            </ul>

            {!isAddingRoom && measureType === 'manual' && (
                <button
                    onClick={handleAddRoomClick}
                    className="w-full py-2 mt-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    Add Room
                </button>
            )}
        </div>
    );
};

export default RoomDetails;

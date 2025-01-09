'use client';
import React, { useState } from 'react';

interface Room {
    roomName: string;
    sqft: string;
    floorType: string;
    difficulty: string;
}

interface MemberRoomDetailsCardProps {
    room: Room;
    index: number;
    onRoomChange: (index: number, field: keyof Room, value: string) => void;
    onDeleteRoom: () => void;
}

const MemberRoomDetailsCard: React.FC<MemberRoomDetailsCardProps> = ({ room, index, onRoomChange, onDeleteRoom }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableRoom, setEditableRoom] = useState(room);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleConfirmClick = () => {
        // Apply changes to the parent component via onRoomChange
        onRoomChange(index, 'roomName', editableRoom.roomName);
        onRoomChange(index, 'sqft', editableRoom.sqft);
        onRoomChange(index, 'floorType', editableRoom.floorType);
        onRoomChange(index, 'difficulty', editableRoom.difficulty);
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        // Revert changes by resetting to the original room data
        setEditableRoom(room);
        setIsEditing(false);
    };

    const handleChange = (field: keyof Room, value: string) => {
        setEditableRoom((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <li className="p-4 bg-green-100 rounded-lg border border-green-300">
            {isEditing ? (
                <div>
                    <label className="block text-green-700 font-semibold mb-2">Room Type</label>
                    <select
                        value={editableRoom.roomName}
                        onChange={(e) => handleChange('roomName', e.target.value)}
                        className="w-full p-2 mb-4 border-2 border-green-500 rounded-lg text-green-700"
                    >
                        <option value="" disabled>Select Room Type</option>
                        <option value="Bedroom">Bedroom</option>
                        <option value="Kitchen">Kitchen</option>
                        <option value="Bathroom">Bathroom</option>
                        {/* Add more options as necessary */}
                    </select>

                    <label className="block text-green-700 font-semibold mb-2">Square Footage</label>
                    <input
                        type="number"
                        value={editableRoom.sqft}
                        onChange={(e) => handleChange('sqft', e.target.value)}
                        className="w-full p-2 mb-4 border-2 border-green-500 rounded-lg text-green-700"
                    />

                    <label className="block text-green-700 font-semibold mb-2">Floor Type</label>
                    <select
                        value={editableRoom.floorType}
                        onChange={(e) => handleChange('floorType', e.target.value)}
                        className="w-full p-2 mb-4 border-2 border-green-500 rounded-lg text-green-700"
                    >
                        <option value="" disabled>Select Floor Type</option>
                        <option value="Wood">Wood</option>
                        <option value="Waxable">Waxable</option>
                        <option value="Non-Waxable">Non-Waxable</option>
                        <option value="Carpet">Carpet</option>
                    </select>

                    <label className="block text-green-700 font-semibold mb-2">Difficulty</label>
                    <select
                        value={editableRoom.difficulty}
                        onChange={(e) => handleChange('difficulty', e.target.value)}
                        className="w-full p-2 mb-4 border-2 border-green-500 rounded-lg text-green-700"
                    >
                        <option value="" disabled>Select Difficulty</option>
                        <option value="Light">Light</option>
                        <option value="Average">Average</option>
                        <option value="Difficult">Difficult</option>
                    </select>

                    <button
                        onClick={handleConfirmClick}
                        className="px-4 py-2 mt-4 mr-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={handleCancelClick}
                        className="px-4 py-2 mt-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <div>
                    <p className="font-semibold text-green-700">Room Type: {room.roomName}</p>
                    <p className="font-semibold text-green-700">Square Footage: {room.sqft}</p>
                    <p className="font-semibold text-green-700">Floor Type: {room.floorType}</p>
                    <p className="font-semibold text-green-700">Difficulty: {room.difficulty}</p>
                    <div className="flex space-x-4 mt-4">
                        <button
                            onClick={handleEditClick}
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                        >
                            Edit
                        </button>
                        <button
                            onClick={onDeleteRoom}
                            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </li>
    );
};

export default MemberRoomDetailsCard;

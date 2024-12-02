// MemberAddRoomCard.tsx
import React from 'react';

interface Room {
    roomName: string;
    sqft: string;
    floorType: string;
    difficulty: string;
}

interface MemberAddRoomCardProps {
    basicRooms: string[];
    newRoom: Room;
    setNewRoom: React.Dispatch<React.SetStateAction<Room>>;
    onAddRoomConfirm: () => void;
}

const MemberAddRoomCard: React.FC<MemberAddRoomCardProps> = ({ basicRooms, newRoom, setNewRoom, onAddRoomConfirm }) => (
    <li className="p-4 bg-blue-100 rounded-lg border border-blue-300 mt-4">
        <label className="block text-blue-700 font-semibold mb-2">Room Type</label>
        <select
            value={newRoom.roomName}
            onChange={(e) => setNewRoom({ ...newRoom, roomName: e.target.value })}
            className="w-full p-2 mb-4 border-2 border-blue-500 rounded-lg text-blue-700 focus:outline-none"
        >
            <option value="" disabled>Select Room Type</option>
            {basicRooms.map((basicRoom, i) => (
                <option key={i} value={basicRoom}>{basicRoom}</option>
            ))}
        </select>

        <label className="block text-blue-700 font-semibold mb-2">Square Footage</label>
        <input
            type="number"
            value={newRoom.sqft}
            onChange={(e) => setNewRoom({ ...newRoom, sqft: e.target.value })}
            className="w-full p-2 mb-4 border-2 border-blue-500 rounded-lg text-blue-700 focus:outline-none"
        />

        <label className="block text-blue-700 font-semibold mb-2">Floor Type</label>
        <select
            value={newRoom.floorType}
            onChange={(e) => setNewRoom({ ...newRoom, floorType: e.target.value })}
            className="w-full p-2 mb-4 border-2 border-blue-500 rounded-lg text-blue-700 focus:outline-none"
        >
            <option value="" disabled>Select Floor Type</option>
            <option value="Wood">Wood</option>
            <option value="Waxable">Waxable</option>
            <option value="Non-Waxable">Non-Waxable</option>
            <option value="Carpet">Carpet</option>
        </select>

        <label className="block text-blue-700 font-semibold mb-2">Difficulty</label>
        <select
            value={newRoom.difficulty}
            onChange={(e) => setNewRoom({ ...newRoom, difficulty: e.target.value })}
            className="w-full p-2 mb-4 border-2 border-blue-500 rounded-lg text-blue-700 focus:outline-none"
        >
            <option value="" disabled>Select Difficulty</option>
            <option value="Light">Light</option>
            <option value="Average">Average</option>
            <option value="Difficult">Difficult</option>
        </select>

        <button
            onClick={onAddRoomConfirm}
            className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
            Add Room
        </button>
    </li>
);

export default MemberAddRoomCard;

'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import LoadingSpinner from '@/components/loadingScreen';

// Define a Room interface to standardize the room data.
export interface Room {
  sqft: number;
  roomType: string;
  floorType: string;
}

interface CustomerAddRoomFormProps {
  onAddRoom: (room: Room) => void;
  onExit: () => void;
  roomTypeOptions: string[];
  rooms: Room[];
}

const CustomerAddRoomForm: React.FC<CustomerAddRoomFormProps> = ({ onAddRoom, onExit, roomTypeOptions, rooms }) => {
  const [sqft, setSqft] = useState('');
  const [roomType, setRoomType] = useState('');
  const [floorType, setFloorType] = useState('Carpet');
  const [loading, setLoading] = useState(false)
  // Options for the floor type dropdown.
  const floorTypeOptions = ['Carpet', 'Other'];
  console.log('roomTypeOptions', roomTypeOptions)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Convert sqft to a number before passing it up.
    const newRoom: Room = {
      sqft: parseFloat(sqft),
      roomType,
      floorType,
    };
    onAddRoom(newRoom);
    // Optionally, reset the form fields.
    setSqft('');
    setRoomType('');
    setFloorType('Carpet');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-200 p-8 mb-8 rounded-xl shadow-2xl max-w-2xl w-full border border-yellow-500">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold text-gray-800">Square Feet:</label>
          <input
            type="number"
            value={sqft}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSqft(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#001F54]"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-800">Room Type:</label>
          <select
            value={roomType}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setRoomType(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#001F54]"
          >
            <option value="" disabled>
              Select Room Type
            </option>
            {roomTypeOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold text-gray-800">Floor Type:</label>
          <select
            value={floorType}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFloorType(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#001F54]"
          >
            {floorTypeOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button type="submit" className="bg-[#001F54] hover:bg-[#001840] text-white py-3 px-6 rounded transition duration-300 w-full">
            Add Room
          </button>
          {rooms.length > 0 && (
            <button onClick={onExit} type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-6 rounded transition duration-300 w-full">
              Back
            </button>
          )}

        </div>
      </form>
    </div>
  );
};

export default CustomerAddRoomForm;

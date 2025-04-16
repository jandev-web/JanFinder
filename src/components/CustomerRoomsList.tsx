'use client';

import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingSpinner from './loadingScreen';

interface Room {
  sqft: number;
  roomType: string;
  floorType: string;
}

interface CustomerRoomListProps {
  rooms: Room[];
  onDeleteRoom: (room: Room) => Promise<void>;
}

const CustomerRoomList: React.FC<CustomerRoomListProps> = ({ rooms, onDeleteRoom }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (room: Room) => {
    setLoading(true);
    await onDeleteRoom(room);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-200 p-10 rounded-xl shadow-2xl max-w-2xl w-full border border-yellow-500">
      <h2 className="text-3xl font-bold text-[#001F54] mb-6 text-center">
        Your Rooms
      </h2>
      {rooms && rooms.length > 0 ? (
        <ul className="space-y-4">
          {rooms.map((room, index) => (
            <li
              key={index}
              className="p-4 bg-gray-50 rounded-md border border-gray-200 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center"
            >
              <div>
                <p className="text-2xl font-semibold text-[#001F54]">
                  {room.roomType}
                </p>
                <p className="text-gray-600">Floor Type: {room.floorType}</p>
                <p className="text-gray-600">
                  <span className="font-semibold text-[#001F54]">Size:</span> {room.sqft} sq.ft.
                </p>
              </div>
              <div className="mt-2 sm:mt-0">
                <button
                  onClick={() => handleDelete(room)}
                  className="flex items-center text-red-500 hover:text-red-600 transition-colors"
                  title="Delete room"
                >
                  <DeleteIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No rooms available.</p>
      )}
    </div>
  );
};

export default CustomerRoomList;

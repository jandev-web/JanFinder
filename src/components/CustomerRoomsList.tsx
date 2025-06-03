'use client';

import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingSpinner from './loadingScreen';

interface Room {
  // Now `sqft` is an object with sub‐keys instead of a single number
  sqft: {
    totalSqft: number;
    carpet:    number;
    tile:      number;
    wood:      number;
    other:     number;
  };
  roomType:   string;
  roomNumber: number;
  // We no longer need a single `floorType: string` field,
  // since each room can have multiple floor‐type sub‐values.
}

interface CustomerRoomListProps {
  roomTypes:   Room[];
  listLoading: boolean;
  onDeleteRoom: (room: Room) => Promise<void>;
}

const CustomerRoomList: React.FC<CustomerRoomListProps> = ({
  roomTypes,
  onDeleteRoom,
  listLoading
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (room: Room) => {
    setLoading(true);
    await onDeleteRoom(room);
    setLoading(false);
  };

  if (loading || listLoading) {
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

      {roomTypes && roomTypes.length > 0 ? (
        <ul className="space-y-4">
          {roomTypes.map((room, index) => {
            // Build an array of floor‐type entries where value > 0
            // Exclude "totalSqft" key.
            const floorEntries: string[] = [];
            const { carpet, tile, wood, other, totalSqft } = room.sqft;

            if (carpet > 0) floorEntries.push(`Carpet: ${carpet} sq.ft.`);
            if (tile   > 0) floorEntries.push(`Tile: ${tile} sq.ft.`);
            if (wood   > 0) floorEntries.push(`Wood: ${wood} sq.ft.`);
            if (other  > 0) floorEntries.push(`Other: ${other} sq.ft.`);

            return (
              <li
                key={index}
                className="p-4 bg-gray-50 rounded-md border border-gray-200 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center"
              >
                <div>
                  <p className="text-2xl font-semibold text-[#001F54]">
                    {room.roomType}
                  </p>

                  {/* Floor Types line (only nonzero entries) */}
                  {floorEntries.length > 0 && (
                    <p className="text-gray-600">
                      <span className="font-semibold text-[#001F54]">Floor Types:</span>{' '}
                      {floorEntries.join(', ')}
                    </p>
                  )}

                  {/* Total size line */}
                  <p className="text-gray-600">
                    <span className="font-semibold text-[#001F54]">Size:</span>{' '}
                    {totalSqft} sq.ft.
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
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No rooms available.</p>
      )}
    </div>
  );
};

export default CustomerRoomList;

// AllRoomsQuote.tsx
'use client';

import React from 'react';
import { Room } from './CustomerAddRoomForm';

interface AllRoomsQuoteProps {
  rooms: Room[];
}

const AllRoomsQuote: React.FC<AllRoomsQuoteProps> = ({ rooms }) => {
  if (rooms.length === 0) {
    return <p>No rooms have been added to this quote yet.</p>;
  }

  return (
    <div className="border p-4 rounded">
      <h3 className="text-xl font-bold mb-4">Rooms in Your Quote</h3>
      <ul className="space-y-2">
        {rooms.map((room, index) => (
          <li key={index} className="border p-2 rounded">
            <p>
              <strong>Room Type:</strong> {room.roomType}
            </p>
            <p>
              <strong>Square Feet:</strong> {room.sqft}
            </p>
            <p>
              <strong>Floor Type:</strong> {room.floorType}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllRoomsQuote;

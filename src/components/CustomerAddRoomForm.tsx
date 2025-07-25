'use client';

import React, { useState, FormEvent } from 'react';
import LoadingSpinner from '@/components/loadingScreen';

interface RoomsData {
  roomTypes: { roomName: string; numberOfRooms: number }[];
  sqft: number;
  floorTypes: {
    hardfloor: number;
    carpet: number;
  };
}

interface CustomerAddRoomFormProps {
  onSubmit: (data: RoomsData) => void;
  onExit: () => void;
  roomTypeOptions: string[];
  roomTypes: any[]; // Unused in form, but kept for exit condition
}

const CustomerAddRoomForm: React.FC<CustomerAddRoomFormProps> = ({
  onSubmit,
  onExit,
  roomTypeOptions,
  roomTypes,
}) => {
  const [sqft, setSqft] = useState<number>(0);
  const [hardfloorPercent, setHardfloorPercent] = useState<number>(50);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);

  console.log(roomTypeOptions)
  const handleRoomTypeToggle = (roomType: string) => {
    setSelectedRoomTypes((prev) => {
      const updated = prev.includes(roomType)
        ? prev.filter((type) => type !== roomType)
        : [...prev, roomType];
      return updated;
    });

    // Reset room count if unselected
    if (selectedRoomTypes.includes(roomType)) {
      setRoomCounts((prev) => {
        const updated = { ...prev };
        delete updated[roomType];
        return updated;
      });
    }
  };

  const handleRoomCountChange = (roomType: string, value: number) => {
    setRoomCounts((prev) => ({
      ...prev,
      [roomType]: value >= 0 ? value : 0,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rooms = selectedRoomTypes
      .filter((type) => roomCounts[type] > 0)
      .map((roomName) => ({
        roomName,
        numberOfRooms: roomCounts[roomName],
      }));

    const formData: RoomsData = {
      sqft,
      roomTypes: rooms,
      floorTypes: {
        hardfloor: hardfloorPercent,
        carpet: 100 - hardfloorPercent,
      },
    };

    console.log('Submitted Form Data:', formData);
    onSubmit(formData);
  };

  const isFormValid = () =>
    sqft > 0 &&
    selectedRoomTypes.length > 0 &&
    selectedRoomTypes.every((type) => roomCounts[type] > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-200 p-8 mb-8 rounded-xl shadow-2xl max-w-2xl w-full border border-yellow-500">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Total Sqft Input */}
        <div>
          <label className="block font-semibold text-gray-800 mb-1">
            Total Square Footage:
          </label>
          <input
            type="number"
            min={0}
            value={sqft}
            onChange={(e) => setSqft(parseInt(e.target.value) || 0)}
            placeholder="Enter total square footage"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#001F54]"
          />
        </div>

        {/* Floor Type Slider */}
        <div>
          <label className="block font-semibold text-gray-800 mb-2">
            Floor Type Distribution:
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={hardfloorPercent}
            onChange={(e) => setHardfloorPercent(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-700 mt-2">
            <span>Hardfloor: {hardfloorPercent}%</span>
            <span>Carpet: {100 - hardfloorPercent}%</span>
          </div>
        </div>

        {/* Room Types */}
        <div>
          <label className="block font-semibold text-gray-800 mb-2">Select Room Types:</label>
          <div className="space-y-2">
            {roomTypeOptions.map((type, index) => (
              <div key={index} className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedRoomTypes.includes(type)}
                    onChange={() => handleRoomTypeToggle(type)}
                    className="mr-2"
                  />
                  {type}
                </label>
                {selectedRoomTypes.includes(type) && (
                  <input
                    type="number"
                    min={1}
                    value={roomCounts[type] || ''}
                    onChange={(e) =>
                      handleRoomCountChange(type, parseInt(e.target.value))
                    }
                    placeholder="Number of rooms"
                    className="p-2 w-32 border rounded focus:outline-none focus:ring-2 focus:ring-[#001F54]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {isFormValid() && (
            <button
              type="submit"
              className="bg-[#001F54] hover:bg-[#001840] text-white py-3 px-6 rounded transition duration-300 w-full"
            >
              Submit Room Data
            </button>
          )}

          {roomTypes.length > 0 && (
            <button
              onClick={onExit}
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-6 rounded transition duration-300 w-full"
            >
              Back
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CustomerAddRoomForm;

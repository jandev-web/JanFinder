'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import LoadingSpinner from '@/components/loadingScreen';
import { manualAddRoom } from '@/utils/updateQuoteRooms';

interface QuoteFormProps {
  quoteID: any;
  facilityType: any;
  facilityRooms: any;
  quoteSqft: any;
  quoteFloorTypes: any;
  onChangeRoomTypes: (newRoomTypes: any, newSqft: any) => void;
  quoteRoomTypes: any;
  onNextStep: (stepNumber: number) => void;
  onMoveOn: (moveOn: boolean) => void;
  onCanClick: (step: any, canClick: boolean) => void;
}

const CustomerAddRooms: React.FC<QuoteFormProps> = ({
  onCanClick,
  quoteID,
  quoteRoomTypes,
  onChangeRoomTypes,
  quoteSqft,
  facilityType,
  quoteFloorTypes,
  facilityRooms,
  onNextStep,
  onMoveOn,
}) => {
  const [roomTypes, setRoomTypes] = useState<any>(quoteRoomTypes);
  const [sqft, setSqft] = useState(quoteSqft);
  const [loading, setLoading] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [hardfloorPercent, setHardfloorPercent] = useState<number>(quoteFloorTypes.hardfloor);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>({});

  console.log('Quote Floor Types:', quoteFloorTypes);
  useEffect(() => {
    if (!roomTypes || roomTypes.length === 0 || hasChanged) {
      onMoveOn(false);
    }
  }, [roomTypes, hasChanged]);

  const handleRoomTypeToggle = (roomType: string) => {
    setSelectedRoomTypes((prev) => {
      const updated = prev.includes(roomType)
        ? prev.filter((type) => type !== roomType)
        : [...prev, roomType];

      // Reset room count if unselected
      if (prev.includes(roomType)) {
        setRoomCounts((prevCounts) => {
          const updatedCounts = { ...prevCounts };
          delete updatedCounts[roomType];
          return updatedCounts;
        });
      }

      setHasChanged(true);
      return updated;
    });
  };

  const handleRoomCountChange = (roomType: string, value: number) => {
    setRoomCounts((prev) => ({
      ...prev,
      [roomType]: value >= 0 ? value : 0,
    }));
    setHasChanged(true);
  };

  const handleSubmit = async (
    e?: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e) e.preventDefault();

    const rooms = selectedRoomTypes
      .filter((type) => roomCounts[type] > 0)
      .map((roomName) => ({
        roomName,
        numberOfRooms: roomCounts[roomName],
      }));

    const formData = {
      sqft,
      roomTypes: rooms,
      floorTypes: {
        hardfloor: hardfloorPercent,
        carpet: 100 - hardfloorPercent,
      },
    };

    setLoading(true);

    try {
      await manualAddRoom(quoteID, formData);
      onChangeRoomTypes(rooms, sqft);
      setRoomTypes(rooms); // Update internal room state
      setHasChanged(false);
      onNextStep(5);
      onCanClick(5, true);
    } catch (error) {
      console.error('Error updating quote:', error);
    } finally {
      setLoading(false);
    }

    console.log('Submitted Form Data:', formData);
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

  if (!quoteID) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingSpinner />
        <p className="text-white mt-4">
          No quote found, please start the process again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="bg-[#001F54] text-white p-8 rounded-md shadow-lg max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Step <span className="text-yellow-500">3</span>: Room Information
        </h1>
        <p className="text-xl">
          Please add the rooms in your {facilityType} facility, along with some
          important information for each room.
        </p>
      </div>

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
            <label className="block font-semibold text-gray-800 mb-2">
              Select Room Types:
            </label>
            <div className="space-y-2">
              {facilityRooms.map((type: any, index: any) => (
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

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {isFormValid() && (
              <button
                type="submit"
                className="bg-[#001F54] hover:bg-[#001840] text-white py-3 px-6 rounded transition duration-300 w-full"
              >
                Submit Room Data
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Confirm Button */}
      {roomTypes.length > 0 && hasChanged && (
        <button
          onClick={handleSubmit}
          className="self-center bg-green-600 hover:bg-[#001840] text-white py-3 px-6 rounded transition duration-300 mt-8"
        >
          Confirm Room Information
        </button>
      )}
    </div>
  );
};

export default CustomerAddRooms;

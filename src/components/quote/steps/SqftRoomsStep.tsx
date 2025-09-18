'use client';

import type { ValidationErrors } from '@/types/quote-ui';
import type { RoomSelection } from '@/types/rooms';
import type { FloorTypes as FloorTypePercentages } from '@/types/quotes';

import RoomPicker from '../RoomPicker';
import FloorTypeSlider from '../FloorTypeSlider';

interface SqftRoomsStepProps {
  sqft: number;
  floorTypePercentages: FloorTypePercentages;
  rooms: RoomSelection[];
  roomOptions: any;
  onChange: (data: {
    sqft: number;
    floorTypePercentages: FloorTypePercentages;
    rooms: RoomSelection[];
  }) => void;
  errors: ValidationErrors;
}

export default function SqftRoomsStep({
  sqft,
  floorTypePercentages,
  rooms,
  roomOptions,
  onChange,
  errors,
}: SqftRoomsStepProps) {
  const updateSqft = (value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({ sqft: numValue, floorTypePercentages, rooms });
  };

  const updateFloorTypePercentages = (newPercentages: FloorTypePercentages) => {
    onChange({ sqft, floorTypePercentages: newPercentages, rooms });
  };

  const updateRooms = (newRooms: RoomSelection[]) => {
    onChange({ sqft, floorTypePercentages, rooms: newRooms });
  };

  return (
    <div className="space-y-8">
      {/* Square Footage Section */}
      <div>
        <label htmlFor="sqft" className="block text-sm font-semibold text-gray-700 mb-4">
          Total Square Footage *
        </label>

        {/* Custom Input Only */}
        <div className="max-w-sm">
          <div className="relative">
            <input
              id="sqft"
              type="number"
              min="0"
              step="100"
              value={sqft || ''}
              onChange={(e) => updateSqft(e.target.value)}
              className={`w-full rounded-xl border px-4 py-3 pr-16 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.sqft
                  ? 'border-red-500 ring-2 ring-red-500'
                  : 'border-gray-300 focus:ring-[#001F54] focus:border-[#001F54]'
              }`}
              placeholder="Enter Square Footage"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              sq ft
            </span>
          </div>
          {errors.sqft && <p className="text-red-600 text-sm mt-2">{errors.sqft}</p>}
          <p className="text-gray-600 text-sm mt-2">Enter the total cleanable square footage</p>
        </div>
      </div>

      {/* Floor Type Distribution */}
      {sqft > 0 && (
        <div className="border-t border-gray-200 pt-8">
          <FloorTypeSlider percentages={floorTypePercentages} onChange={updateFloorTypePercentages} />
        </div>
      )}

      {/* Room Selection Section */}
      <div className="border-t border-gray-200 pt-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#001F54] mb-2">Room Types & Quantities *</h3>
          <p className="text-gray-600 text-sm">
            Select the types of rooms in your facility and specify how many of each type you have.
          </p>
        </div>

        <RoomPicker selectedRooms={rooms} onChange={updateRooms} roomOptions={roomOptions} />

        {errors.rooms && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
            <p className="text-red-600 text-sm font-medium">{errors.rooms}</p>
          </div>
        )}
      </div>

      {/* Summary Card */}
      {sqft > 0 && rooms.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl p-6 border border-gray-200">
          <h4 className="font-semibold text-[#001F54] mb-4">Facility Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#001F54] mb-1">{sqft.toLocaleString()}</div>
                <div className="text-gray-600">Total Square Feet</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {Math.round((floorTypePercentages.carpet / 100) * sqft).toLocaleString()}
                </div>
                <div className="text-gray-600">Carpet Sq Ft</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-1">
                  {Math.round((floorTypePercentages.hardfloor / 100) * sqft).toLocaleString()}
                </div>
                <div className="text-gray-600">Hard Floor Sq Ft</div>
              </div>
            </div>
          </div>

          {rooms.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="font-medium text-gray-700 mb-2">Room Breakdown:</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {rooms.map((room) => (
                  <div
                    key={room.roomType}
                    className="flex justify-between bg-gray-50 rounded px-3 py-1"
                  >
                    <span className="text-gray-700">{room.roomType}</span>
                    <span className="font-semibold text-[#001F54]">{room.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

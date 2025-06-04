'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import LoadingSpinner from '@/components/loadingScreen';

// Define a Room interface to standardize the room data.
export interface Room {
  sqft: any;
  roomType: string;
  roomNumber: number;
}

interface CustomerAddRoomFormProps {
  onAddRoom: (room: Room) => void;
  onExit: () => void;
  roomTypeOptions: string[];
  roomTypes: Room[];
}

const CustomerAddRoomForm: React.FC<CustomerAddRoomFormProps> = ({ onAddRoom, onExit, roomTypeOptions, roomTypes }) => {
  const [sqft, setSqft] = useState(0);
  const [roomType, setRoomType] = useState('');
  const [roomNumber, setRoomNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedFloorTypes, setSelectedFloorTypes] = useState<string[]>([]);
  const [sqftValues, setSqftValues] = useState<Record<string, number>>({});

  const floorTypeOptions = ['Wood', 'Tile', 'Carpet', 'Other']; // Example options

  const handleCheckboxChange = (floorType: string) => {
    const isSelected = selectedFloorTypes.includes(floorType);
  
    if (isSelected) {
      // Unselecting: remove from selectedFloorTypes and zero out its sqft
      const updatedFloorTypes = selectedFloorTypes.filter((type) => type !== floorType);
      setSelectedFloorTypes(updatedFloorTypes);
  
      setSqftValues((prev) => {
        const updatedSqftValues = { ...prev, [floorType]: 0 };
  
        // Recalculate total based on the updated values
        const newTotal = Object.values(updatedSqftValues).reduce((sum, v) => sum + v, 0);
        setSqft(newTotal);
  
        return updatedSqftValues;
      });
    } else {
      // Selecting: just add it to selectedFloorTypes (leave its sqft at whatever it was—or undefined)
      setSelectedFloorTypes((prev) => [...prev, floorType]);
    }
  };
  

  const handleSqftChange = (e: React.ChangeEvent<HTMLInputElement>, floorType: string) => {
    const value = Number(e.target.value);
    const newSqft = value >= 0 ? value : 0; // Ensure non-negative value

    // Update sqftValues for the specific floor type
    setSqftValues((prev) => {
      const updatedSqftValues = {
        ...prev,
        [floorType]: newSqft,
      };

      // Calculate the total sqft sum
      const total = Object.values(updatedSqftValues).reduce((sum, sqft) => sum + sqft, 0);

      // Update the total square footage
      setSqft(total);

      return updatedSqftValues;
    });
  };


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Convert sqft to a number before passing it up.
    const newRoom: Room = {
      sqft: {
        totalSqft: sqft,
        carpet: sqftValues['Carpet'] ?? 0,
        tile:   sqftValues['Tile']   ?? 0,
        wood:   sqftValues['Wood']   ?? 0,
        other:  sqftValues['Other']  ?? 0,
      },
      roomType,
      roomNumber: parseFloat(roomNumber),
    };
    console.log(newRoom)
    onAddRoom(newRoom);
    // Optionally, reset the form fields.
    setSqft(0);
    setRoomType('');
    setSqftValues({})
    setRoomNumber('')
    setSelectedFloorTypes([])
  };

  const isFormValid = () => {
    // Check if at least one floor type is selected
    const isFloorTypeSelected = selectedFloorTypes.length > 0;

    // Check if sqft is greater than 0
    const isSqftValid = sqft > 0;

    // Check if roomNumber is greater than 0
    const isRoomNumberValid = parseFloat(roomNumber) > 0;

    // Ensure that for each selected floor type, there is a corresponding sqft value
    const isSqftPerFloorTypeValid = selectedFloorTypes.every(floorType => sqftValues[floorType] > 0);
    const isAllValid = isFloorTypeSelected && isSqftValid && isRoomNumberValid && isSqftPerFloorTypeValid;
    console.log(isAllValid)
    return isAllValid
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

        {roomType !== '' && (
          <>
            {/* Input for Total Square Feet */}
            <div>
              <label className="block font-semibold text-gray-800">
                Total Square Feet for {roomType}:
              </label>
              <p>{sqft}</p>
            </div>

            {/* Select for Floor Type */}
            <div>
              <label className="block font-semibold text-gray-800">Floor Type:</label>
              <div>
                {floorTypeOptions.map((option, index) => (
                  <div key={index} className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id={option}
                      value={option}
                      checked={selectedFloorTypes.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      className="mr-2"
                    />
                    <label htmlFor={option} className="mr-4">
                      {option}
                    </label>

                    {/* If the floor type is selected, show the sqft input */}
                    {selectedFloorTypes.includes(option) && (
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={sqftValues[option] || ''}
                          onChange={(e) => handleSqftChange(e, option)}
                          placeholder="Enter sqft"
                          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#001F54]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Select for Number of Rooms */}
            <div>
              <label className="block font-semibold text-gray-800">
                Number of {roomType}:
              </label>
              <input
                type="number"
                value={roomNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRoomNumber(e.target.value)}
                required
                min={0} // Prevents entering negative numbers
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#001F54]"
              />
            </div>

          </>
        )}   




        <div className="flex flex-col sm:flex-row gap-4">
          {isFormValid() &&
            <button type="submit" className="bg-[#001F54] hover:bg-[#001840] text-white py-3 px-6 rounded transition duration-300 w-full">
              Add Room
            </button>
          }

          {roomTypes.length > 0 && (
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

'use client';

import { useState } from 'react';


interface RoomPickerProps {
  selectedRooms: any[];
  roomOptions: any;
  onChange: (rooms: any[]) => void;
}

export default function RoomPicker({ selectedRooms, onChange, roomOptions }: RoomPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoomTypes = roomOptions.filter((roomType: any) =>
    roomType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addRoom = (roomType: string) => {
    const existing = selectedRooms.find(r => r.roomType === roomType);
    if (!existing) {
      onChange([...selectedRooms, { roomType, count: 1 }]);
    }
  };

  const removeRoom = (roomType: string) => {
    onChange(selectedRooms.filter(r => r.roomType !== roomType));
  };

  const updateRoomCount = (roomType: string, count: number) => {
    if (count <= 0) {
      removeRoom(roomType);
      return;
    }
    
    onChange(selectedRooms.map(r => 
      r.roomType === roomType ? { ...r, count } : r
    ));
  };

  const isSelected = (roomType: string) => 
    selectedRooms.some(r => r.roomType === roomType);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search room types..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#001F54] focus:border-[#001F54] focus:outline-none transition-all duration-200"
        />
      </div>

      {/* Available Room Types */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3">Available Room Types</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredRoomTypes.map((roomType: any) => (
            <button
              key={roomType}
              onClick={() => addRoom(roomType)}
              disabled={isSelected(roomType)}
              className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 text-center ${
                isSelected(roomType)
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-[#F5C542] hover:bg-yellow-50 hover:text-[#001F54] cursor-pointer'
              }`}
            >
              {roomType}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Rooms */}
      {selectedRooms.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Selected Rooms</h4>
          <div className="space-y-3">
            {selectedRooms.map((room) => (
              <div
                key={room.roomType}
                className="flex items-center justify-between p-4 bg-yellow-50 border-2 border-[#F5C542] rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-[#001F54]">{room.roomType}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateRoomCount(room.roomType, room.count - 1)}
                      className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <input
                      type="number"
                      min="1"
                      value={room.count}
                      onChange={(e) => updateRoomCount(room.roomType, parseInt(e.target.value) || 1)}
                      className="w-16 text-center py-1 px-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#001F54] focus:border-[#001F54] focus:outline-none"
                    />
                    
                    <button
                      onClick={() => updateRoomCount(room.roomType, room.count + 1)}
                      className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeRoom(room.roomType)}
                    className="w-8 h-8 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {selectedRooms.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#001F54]">
              Total Rooms: {selectedRooms.reduce((sum, room) => sum + room.count, 0)}
            </span>
            <span className="text-sm text-gray-600">
              {selectedRooms.length} room type{selectedRooms.length > 1 ? 's' : ''} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
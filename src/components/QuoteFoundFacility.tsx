'use client';

import React, { useState } from 'react';

const QuoteFoundFacility: React.FC<{ facilityInfo: any }> = ({ facilityInfo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="mb-4">
      <button
        onClick={toggleDropdown}
        className="w-full flex justify-between items-center bg-yellow-400 text-[#001F54] text-lg font-medium px-4 py-3 rounded-lg shadow-md hover:bg-yellow-300 transition duration-300"
      >
        Facility Information
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="mt-3 p-4 border border-[#001F54] rounded-lg bg-yellow-100">
          <p>
            <strong>Facility Type:</strong> {facilityInfo?.facilityType || 'N/A'}
          </p>
          <p>
            <strong>Square Footage:</strong> {facilityInfo?.sqft || 'N/A'}
          </p>
          <p>
            <strong>Selected Rooms:</strong>{' '}
            {facilityInfo?.selectedRooms
              ? Object.entries(facilityInfo.selectedRooms)
                  .map(([room, count]) => `${room}: ${count}`)
                  .join(', ')
              : 'N/A'}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuoteFoundFacility;

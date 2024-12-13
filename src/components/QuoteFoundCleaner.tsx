'use client';

import React, { useState } from 'react';

const QuoteFoundCleaner: React.FC<{ cleanerInfo: any }> = ({ cleanerInfo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="mb-4">
      <button
        onClick={toggleDropdown}
        className="w-full flex justify-between items-center bg-green-400 text-white text-lg font-medium px-4 py-3 rounded-lg shadow-md hover:bg-green-300 transition duration-300"
      >
        Cleaner Information
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="mt-3 p-4 border border-green-500 rounded-lg bg-green-100 text-[#001F54]">
          <p>
            <strong>Cleaner Name:</strong> {cleanerInfo?.name || 'N/A'}
          </p>
          <p>
            <strong>Contact:</strong> {cleanerInfo?.contact || 'N/A'}
          </p>
          <p>
            <strong>Assigned Date:</strong> {cleanerInfo?.assignedDate || 'N/A'}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuoteFoundCleaner;

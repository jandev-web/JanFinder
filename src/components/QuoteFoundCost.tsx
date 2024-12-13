'use client';

import React, { useState } from 'react';

const QuoteFoundCost: React.FC<{ costInfo: any }> = ({ costInfo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="mb-4">
      <button
        onClick={toggleDropdown}
        className="w-full flex justify-between items-center bg-blue-400 text-white text-lg font-medium px-4 py-3 rounded-lg shadow-md hover:bg-blue-300 transition duration-300"
      >
        Cost Information
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="mt-3 p-4 border border-blue-500 rounded-lg bg-blue-100 text-[#001F54]">
          <p>
            <strong>Budget:</strong> {costInfo?.budget || 'N/A'}
          </p>
          <p>
            <strong>Total Cost:</strong> {costInfo?.total || 'N/A'}
          </p>
          <p>
            <strong>Additional Fees:</strong> {costInfo?.additionalFees || 'None'}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuoteFoundCost;

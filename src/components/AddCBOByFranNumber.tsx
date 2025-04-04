import React, { useState } from 'react';

interface CopyAccountNumberProps {
  accountNumber: string;
}

const CopyAccountNumber: React.FC<CopyAccountNumberProps> = ({ accountNumber }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy!', error);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow border border-gray-200">
      <p className="text-lg font-mono text-gray-800">{accountNumber}</p>
      <button
        onClick={handleCopy}
        className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {/* This is a clipboard icon from Heroicons */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m2-12H7a2 2 0 00-2 2v12a2 2 0 002 2h8l4-4V6a2 2 0 00-2-2z"
          />
        </svg>
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>
    </div>
  );
};

export default CopyAccountNumber;

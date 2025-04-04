import React from 'react';

interface RequestFranchiseNotFoundProps {
  franchiseAccountNumber: string;
  onGoBack: () => void;
}

const RequestFranchiseNotFound: React.FC<RequestFranchiseNotFoundProps> = ({ franchiseAccountNumber, onGoBack }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
        <h2 className="text-2xl font-bold text-[#001F54] mb-4">Franchise Not Found</h2>
        <p className="text-gray-700 mb-6">
          No franchise was found with the account number: <strong>{franchiseAccountNumber}</strong>
        </p>
        <button
          onClick={onGoBack}
          className="py-2 px-4 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default RequestFranchiseNotFound;

import React from 'react';

interface RequestJoinFranchiseInputProps {
  franchiseAccountNumber: string;
  setFranchiseAccountNumber: (value: string) => void;
  onSubmit: (accountNumber: string) => void;
  error: string;
}

const RequestJoinFranchiseInput: React.FC<RequestJoinFranchiseInputProps> = ({
  franchiseAccountNumber,
  setFranchiseAccountNumber,
  onSubmit,
  error
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(franchiseAccountNumber);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-[#001F54] mb-4">Join a Franchise</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          value={franchiseAccountNumber}
          onChange={(e) => setFranchiseAccountNumber(e.target.value)}
          placeholder="Enter Franchise Account Number"
          className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RequestJoinFranchiseInput;

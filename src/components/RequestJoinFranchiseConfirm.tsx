import React from 'react';

interface RequestJoinFranchiseConfirmProps {
  franchiseName: string;
}

const RequestJoinFranchiseConfirm: React.FC<RequestJoinFranchiseConfirmProps> = ({ franchiseName }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
        <h1 className="text-3xl font-bold text-[#001F54] mb-4">
          Request Submitted
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Thank you for your interest in joining <span className="font-semibold">{franchiseName}</span>. Your request has been successfully submitted and is currently under review.
        </p>
        <p className="text-md text-gray-600">
          You will receive an email confirmation once your application has been approved.
        </p>
      </div>
    </div>
  );
};

export default RequestJoinFranchiseConfirm;

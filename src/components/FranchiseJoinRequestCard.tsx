'use client';

import React, { useState } from 'react';
import acceptRequest from '@/utils/acceptFranchiseJoinRequest';
import denyRequest from '@/utils/denyFranchiseJoinRequest';
import { useRouter } from 'next/navigation';

interface FranchiseJoinRequestCardProps {
  request: any;
  ownerID: any;
}

const FranchiseJoinRequestCard: React.FC<FranchiseJoinRequestCardProps> = ({ request, ownerID }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [actionStatus, setActionStatus] = useState<string>('');
  const router = useRouter();

  const handleAccept = async () => {
    try {
      await acceptRequest(request.RequestID, ownerID);
      setActionStatus('Accepted');
      // Reload/navigate to the requests page
      router.push('/members/owner/cbos/requests');
    } catch (error) {
      setActionStatus('Error accepting request');
      console.error(error);
    }
  };

  const handleDeny = async () => {
    try {
      await denyRequest(request.RequestID, ownerID);
      setActionStatus('Denied');
      // Reload/navigate to the requests page
      router.push('/members/owner/cbos/requests');
    } catch (error) {
      setActionStatus('Error denying request');
      console.error(error);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white mb-4">
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">
          {request.userInfo.firstName} {request.userInfo.lastName}
        </p>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
      </div>
      {showDetails && (
        <div className="mt-4 border-t pt-4">
          {request.userInfo.email && (
            <p>
              <strong>Email:</strong> {request.userInfo.email}
            </p>
          )}
          {request.userInfo.phone && (
            <p>
              <strong>Phone:</strong> {request.userInfo.phone}
            </p>
          )}
          {request.userInfo.address && (
            <div>
              <p className="font-semibold">Address:</p>
              <p>{request.userInfo.address.street}</p>
              <p>
                {request.userInfo.address.city}, {request.userInfo.address.state}{' '}
                {request.userInfo.address.postalCode}
              </p>
              <p>{request.userInfo.address.country}</p>
            </div>
          )}
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={handleDeny}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Deny
            </button>
          </div>
          {actionStatus && (
            <p className="mt-2 text-sm font-semibold">
              Status: {actionStatus}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FranchiseJoinRequestCard;

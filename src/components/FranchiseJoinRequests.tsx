'use client';

import React, { useEffect, useState } from 'react';
import getJoinFranchiseRequests from '@/utils/getJoinFranchiseRequests';
import FranchiseJoinRequestCard from './FranchiseJoinRequestCard';

interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface UserInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: Address;
}

interface JoinRequest {
  RequestID: string;
  franchiseID: string;
  userInfo: UserInfo;
  timestamp?: string;
}

interface FranchiseJoinRequestsProps {
  user: any;
}

const FranchiseJoinRequests: React.FC<FranchiseJoinRequestsProps> = ({ user }) => {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const franchiseID = user.franchiseID;
  const ownerID = user.OwnerID
  useEffect(() => {
    async function fetchRequests() {
      try {
        const result = await getJoinFranchiseRequests(franchiseID);
        console.log(result);
        // Assumes result returns an object with an 'items' array.
        setRequests(result?.items || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching join requests.');
      } finally {
        setLoading(false);
      }
    }
    
    if (franchiseID) {
      fetchRequests();
    }
  }, [franchiseID]);

  if (loading) {
    return <div>Loading join requests...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Join Requests</h2>
      {requests.length === 0 ? (
        <p>No join requests found for this franchise.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <FranchiseJoinRequestCard key={req.RequestID} request={req} ownerID={ownerID} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default FranchiseJoinRequests;

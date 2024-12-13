'use client';

import React, { useState, useEffect } from 'react';
import OwnerHeader from '@/components/OwnerHeader';
import getFranchiseInfo from '@/utils/getFranchiseInfo';
import fetchOwnerById from '@/utils/getOwnerById';

interface FranchisePageProps {
  user: any;
}

const FranchisePage: React.FC<FranchisePageProps> = ({ user }) => {
  const [franchise, setFranchise] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.sub) {
          const userInfo = await fetchOwnerById(user.sub);
          const franchiseData = await getFranchiseInfo(userInfo.franchiseID);
          console.log(franchiseData);
          setFranchise(franchiseData);
        }
      } catch (error) {
        console.error('Error fetching franchise info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-yellow-300">
      <OwnerHeader user={user} />
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-5xl font-bold text-green-800 mb-6">{franchise?.franchiseName} Franchise Page</h1>
          <p className="text-gray-700 text-lg mb-4">
            Welcome to the {franchise?.franchiseName} franchise page.
          </p>
          <button className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md">
            Get a Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default FranchisePage;

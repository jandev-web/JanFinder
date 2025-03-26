'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getFranchiseInfo from '@/utils/getFranchiseInfo';
import EditFranchiseQuoteComponent from '@/components/EditFranchiseQuoteComponent';
import fetchOwnerById from '@/utils/getOwnerById';

interface EditFranchiseQuoteProps {
  user: any;
}

const EditFranchiseQuote: React.FC<EditFranchiseQuoteProps> = ({ user }) => {
  const [franchise, setFranchise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          router.push('/members/sign-in');
          return;
        }

        const fetchedUserInfo = await fetchOwnerById(user.userId);
        const franchiseData = await getFranchiseInfo(fetchedUserInfo.franchiseID);
        setFranchise(franchiseData);

      } catch (error) {
        console.error('Error fetching franchise info:', error);
        //router.push('/error')
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  return (
    <div className="max-w-md mx-auto bg-white p-6">
        <button
        className="absolute top-4 left-4 pt-2 pb-10 pl-4 pr-4 text-lg font-semibold text-[#001F54] hover:text-yellow-500 transition duration-300"
        onClick={() => router.push('/members/owner/franchise')}
      >
        &lt; Back to Franchise Info
      </button>
      <EditFranchiseQuoteComponent franchise={franchise} user={user} />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default EditFranchiseQuote;

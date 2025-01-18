'use client';

import React, { useState, useEffect } from 'react';
import OwnerHeader from '@/components/OwnerHeader';
import getFranchiseInfo from '@/utils/getFranchiseInfo';
import fetchOwnerById from '@/utils/getOwnerById';
import OwnerFranchisePage from '@/components/OwnerFranchisePage';
import LoadingSpinner from '@/components/loadingScreen'

import { useRouter } from 'next/navigation';


interface FranchisePageProps {
  user: any;
}

const FranchisePage: React.FC<FranchisePageProps> = ({ user }) => {
  //console.log(user)
  const router = useRouter()
  const [franchise, setFranchise] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          router.push('/members/sign-in');
          return;
        }

        const fetchedUserInfo = await fetchOwnerById(user.userId);
        setUserInfo(fetchedUserInfo);
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

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="pb-10">
        <OwnerHeader user={userInfo} />
      </div>
      <div className='pt-36'>
        <OwnerFranchisePage user={userInfo} franchise={franchise} />

      </div>

    </div>
  );
};

export default FranchisePage;


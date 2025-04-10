'use client';

import React, { useState, useEffect } from 'react';
import CBOHeader from '@/components/CBOHeader';
import getFranchiseInfo from '@/utils/getFranchiseInfo';
import fetchCBOById from '@/utils/getCBOByID';
import CBOFranchisePage from '../CBOFranchiseInfoPage';
import LoadingSpinner from '@/components/loadingScreen'
import CBOFooter from '../CBOFooter';
import { useRouter } from 'next/navigation';
import getOwnerByFranchise from '@/utils/getOwnerByFranchise';

interface FranchisePageProps {
  user: any;
}

const FranchisePage: React.FC<FranchisePageProps> = ({ user }) => {
  //console.log(user)
  const router = useRouter()
  const [franchise, setFranchise] = useState(null);
  const [owner, setOwner] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          router.push('/members/sign-in');
          return;
        }

        const fetchedUserInfo = await fetchCBOById(user.userId);
        setUserInfo(fetchedUserInfo);
        const franchiseData = await getFranchiseInfo(fetchedUserInfo.franchiseID);
        setFranchise(franchiseData);
        const ownerData = await getOwnerByFranchise(fetchedUserInfo.franchiseID);
        setOwner(ownerData.owner);
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
        <CBOHeader user={userInfo} />
      </div>
      <div className='pt-36'>
        <CBOFranchisePage franchise={franchise} owner={owner} />

      </div>
      <CBOFooter />

    </div>
  );
};

export default FranchisePage;


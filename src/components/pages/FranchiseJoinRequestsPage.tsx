'use client'

import React, { useEffect, useState } from 'react';
import AllCBOs from '@/components/pages/AllCBOs';
import OwnerHeader from '@/components/OwnerHeader';
import fetchOwnerById from '@/utils/getOwnerById';
import LoadingSpinner from '@/components/loadingScreen';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';
import OwnerFooter from '../OwnerFooter';
import FranchiseJoinRequests from '../FranchiseJoinRequests';
export const dynamic = "force-dynamic";

interface FranchiseJoinRequestsPageProps {
    user: any;
}

const FranchiseJoinRequestsPage: React.FC<FranchiseJoinRequestsPageProps> = ({ user }) => {
    const router = useRouter()
    const [ownerData, setOwnerData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            if (!user) {
              redirect('/business/sign-in');
              return;
            }
    
            // Fetch owner data by user ID
            //console.log(user)
            const fetchedOwnerData = await fetchOwnerById(user.userId);
            setOwnerData(fetchedOwnerData);
          } catch (error) {
            console.error('Error fetching current user:', error);
            router.push('/error'); // Redirect to an error page if needed
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchUser();
      }, [user, router]);




      if (isLoading) {
        return <LoadingSpinner />
      }
      if (!ownerData) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <p>Owner data not found.</p>
          </div>
        );
      }

    return (
      <div className="flex flex-col w-full min-h-screen">
            {/* Header with padding-bottom */}
            <div className="pb-10">
                <OwnerHeader user={ownerData} />
            </div>

            <div className='pt-24'>
                <FranchiseJoinRequests user={ownerData} />
            </div>
            <OwnerFooter />

        </div>
    );
  
  }

export default FranchiseJoinRequestsPage
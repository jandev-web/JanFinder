'use client'

import React, { useEffect, useState } from 'react';
import AllCBOs from '@/components/pages/AllCBOs';
import OwnerHeader from '@/components/OwnerHeader';
import fetchOwnerById from '@/utils/getOwnerById';
import LoadingSpinner from '@/components/loadingScreen';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

interface OwnerCBOsPageProps {
    user: any;
}

const OwnerCBOsPage: React.FC<OwnerCBOsPageProps> = ({ user }) => {
    const router = useRouter()
    const [ownerData, setOwnerData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            if (!user) {
              redirect('/members/sign-in');
              return;
            }
    
            // Fetch owner data by user ID
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="pt-10">
          <OwnerHeader user={ownerData} />
        </div>
        <div className="flex-1 flex pt-10">
          <AllCBOs user={ownerData} />
        </div>
      </div>
    );
  
  }

export default OwnerCBOsPage
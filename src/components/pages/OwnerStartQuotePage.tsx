'use client'

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import OwnerHeader from '@/components/OwnerHeader';
import MemberStartQuotePage from '@/components/pages/MemberStartQuotePage';
import fetchOwnerById from '@/utils/getOwnerById';
import LoadingSpinner from '@/components/loadingScreen'
import OwnerFooter from '../OwnerFooter';
import { useRouter } from 'next/navigation';

interface OwnerStartQuotePageProps {
    user: any;
}

const OwnerStartQuotePage: React.FC<OwnerStartQuotePageProps> = ({ user }) => {
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
            console.log(fetchedOwnerData)
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
      <div className="flex flex-col w-full items-center justify-center min-h-screen">
        <div className="w-full pt-10">
          <OwnerHeader user={ownerData} />
        </div>
        <div className="flex-1 flex pt-24">
          <MemberStartQuotePage user={ownerData} />
        </div>
        <OwnerFooter />
      </div>
    );
  
};

export default OwnerStartQuotePage;

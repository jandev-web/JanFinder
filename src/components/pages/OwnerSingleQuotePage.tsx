'use client'

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import fetchOwnerById from '@/utils/getOwnerById';
import LoadingSpinner from '@/components/loadingScreen'

import OwnerQuote from './SingleOwnerQuote';
import OwnerHeader from '../OwnerHeader';

import { useRouter } from 'next/navigation';



interface OwnerSingleQuoteProps {
    user: any;
    quoteID: any;
    prevPage: any;
  }

const OwnerSingleQuote: React.FC<OwnerSingleQuoteProps> = ({ user, quoteID, prevPage }) => {
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


    //console.log("pages/MemberPage.tsx:", user);
    //console.log(isOwner)
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header with padding-bottom */}
            <div className="pt-10">
                <OwnerHeader user={ownerData} />
            </div>

            {/* Main content area */}

            <OwnerQuote user={ownerData} quoteID={quoteID} prevPage={prevPage}/>

        </div>
    );


};

export default OwnerSingleQuote;

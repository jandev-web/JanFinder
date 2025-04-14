'use client'

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import LoadingSpinner from '@/components/loadingScreen'

import CBOQuote from '../SingleCBOQuoteAccepted';
import CBOFooter from '@/components/CBOFooter'; 

import { useRouter } from 'next/navigation';
import fetchCBOById from '@/utils/getCBOByID';



interface CBOSingleQuoteProps {
    user: any;
    quoteID: any;
  }

const CBOSingleAcceptedQuote: React.FC<CBOSingleQuoteProps> = ({ user, quoteID }) => {
    const router = useRouter()
    const [cboData, setCBOData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            if (!user) {
              redirect('/members/sign-in');
              return;
            }
    
            // Fetch owner data by user ID
            const fetchedCBOData = await fetchCBOById(user.userId);
            setCBOData(fetchedCBOData);
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
      if (!cboData) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <p>Member data not found.</p>
          </div>
        );
      }


    //console.log("pages/MemberPage.tsx:", user);
    //console.log(isOwner)
    return (
        <div className="flex flex-col w-full min-h-screen">

            <CBOQuote user={cboData} quoteID={quoteID}/>
            <CBOFooter />
        </div>
    );


};

export default CBOSingleAcceptedQuote;

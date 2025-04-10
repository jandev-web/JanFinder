'use client'

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import fetchCBOById from '@/utils/getCBOByID';
import CBOComponent from '@/components/CBOComponent';
import CBOFooter from '../CBOFooter';
import CBOHeader from '../CBOHeader';
import LoadingSpinner from '@/components/loadingScreen'


interface CBOPageProps {
    user: any;
    
}

const CBOPage: React.FC<CBOPageProps> = ({ user }) => {

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
            const fetchedOwnerData = await fetchCBOById(user.userId);
            setCBOData(fetchedOwnerData);
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
            <p>CBO data not found.</p>
          </div>
        );
      }


    //console.log("pages/MemberPage.tsx:", user);
    //console.log(isOwner)
    return (
        <div className="flex flex-col w-full min-h-screen">
            {/* Header with padding-bottom */}
            <div className="pb-14">
                <CBOHeader user={cboData} />
            </div>

            {/* Main content area */}

            <CBOComponent user={cboData} />
            <CBOFooter />

        </div>
    );


};

export default CBOPage;

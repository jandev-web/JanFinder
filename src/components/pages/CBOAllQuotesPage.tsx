'use client'

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import fetchCBOById from '@/utils/getCBOByID';
import LoadingSpinner from '@/components/loadingScreen'
import CBOFooter from '../CBOFooter';
import AllQuotes from '../CBOAllQuotes';
import CBOHeader from '../CBOHeader';

import { useRouter } from 'next/navigation';



interface CBOAllQuotesPageProps {
    user: any;
}

const CBOAllQuotesPage: React.FC<CBOAllQuotesPageProps> = ({ user }) => {
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
        <div className="flex flex-col min-h-screen">
            {/* Header with padding-bottom */}
            <div className="pb-10">
                <CBOHeader user={cboData} />
            </div>

            <div className='pt-24'>
              <AllQuotes user={cboData} />
            </div>
            <CBOFooter />
            

        </div>
    );


};

export default CBOAllQuotesPage;

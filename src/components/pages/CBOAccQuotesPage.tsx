'use client'

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import LoadingSpinner from '@/components/loadingScreen'
import CBOFooter from '../CBOFooter';
import CBOAccQuotes from '@/components/CBOAcceptedQuotes'
import CBOHeader from '../CBOHeader';
import fetchCBOById from '@/utils/getCBOByID';
import { useRouter } from 'next/navigation';



interface CBOAccQuotesPageProps {
    user: any;
}

const CBOAcceptedQuotesPage: React.FC<CBOAccQuotesPageProps> = ({ user }) => {
    const router = useRouter()
    const [cboData, setCBOData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    //console.log(user)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!user) {
                    redirect('/business/sign-in');
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
        <div className="flex flex-col min-h-screen">
            {/* Header with padding-bottom */}
            <div className="pb-10">
                <CBOHeader user={cboData} />
            </div>

            <div className='pt-24'>
                <CBOAccQuotes user={cboData} />
            </div>
            <CBOFooter />


        </div>
    );


};

export default CBOAcceptedQuotesPage;

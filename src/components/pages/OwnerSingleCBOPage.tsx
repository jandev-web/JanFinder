'use client'

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import SingleCBOPage from '@/components/pages/singleCBOPage';
import OwnerHeader from '@/components/OwnerHeader';
import LoadingSpinner from '@/components/loadingScreen';
import fetchOwnerById from '@/utils/getOwnerById';
import { useRouter } from 'next/navigation';

interface OneCBOPageProps {
    user: any;
}


const OneCBO: React.FC<OneCBOPageProps> = ({ user }) => {
    const router = useRouter()
    const [ownerData, setOwnerData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!user) {
                    redirect('/members/sign-in');

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
        <div className="flex flex-col min-h-screen w-full bg-gray-100">
            {/* Header Section */}
            <div className="sticky top-0 z-10 bg-white shadow-md">
                <div className="py-6 px-4 pb-24 border-b">
                    <OwnerHeader user={ownerData} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center pt-24 justify-start px-6 py-10">
                <SingleCBOPage user={ownerData} />
            </div>
        </div>

    );


};

export default OneCBO;


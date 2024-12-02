'use client'

import React, { useEffect, useState } from 'react';

import OwnerComponent from '../OwnerComponent';
import OwnerHeader from '../OwnerHeader';

import { useRouter } from 'next/navigation';


import { fetchUserAttributes } from 'aws-amplify/auth';
import { getCurrentUser } from 'aws-amplify/auth';
import { useAuthenticator } from '@aws-amplify/ui-react';


interface OwnerPageProps {
    user: any;
}

const OwnerPage: React.FC<OwnerPageProps> = ({ user }) => {
    const router = useRouter()
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    //const { user, signOut } = useAuthenticator((context) => [context.user]);
    useEffect(() => {
        const fetchUser = async () => {
            try {

                setCurrentUser(user);
                console.log("Current User:", user);
                if (user === null) {
                    router.push('/members/signIn?logOut=true')
                }
                //console.log("Attributes: ", attributes)
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchUser();
    }, []);







    //console.log("pages/MemberPage.tsx:", user);
    //console.log(isOwner)
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header with padding-bottom */}
            <div className="pt-10">
                <OwnerHeader user={user} />
            </div>

            {/* Main content area */}
            
                <OwnerComponent user={user} />
            
        </div>
    );


};

export default OwnerPage;

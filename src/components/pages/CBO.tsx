'use client'

import React, { useEffect, useState } from 'react';

import CBOComponent from '@/components/CBOComponent';

import CBOHeader from '../CBOHeader';


interface CBOPageProps {
    user: any;
    
}

const CBOPage: React.FC<CBOPageProps> = ({ user }) => {

    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    

    useEffect(() => {
        const fetchUser = async () => {
            try {
                //const user = await getCurrentUser();
                setCurrentUser(user);
                console.log("User:", user);
                //const attributes = await fetchUserAttributes();
                //console.log("Attributes: ", attributes)
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchUser();
    }, []);




    /*
    if (loading) {
        return <div>Loading...</div>; // Show a loading state while checking
    }
    */

    //console.log("pages/CBO.tsx:", user);
    //console.log(isOwner)
    return (
        <div className="flex flex-col min-h-screen">


<div className="pt-10">
                <CBOHeader user={user} />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex pt-10">
                <CBOComponent user={user} />
            </div>
        </div>
    );
};

export default CBOPage;

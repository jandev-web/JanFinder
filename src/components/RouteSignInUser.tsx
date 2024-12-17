'use client';

import React, { useEffect, useState } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation'; // Use useRouter from next/navigation
import { checkIsOwner } from '@/utils/checkIsOwner';
import MemberLoadingScreen from '@/components/pages/MemberPageLoading';

interface RoleRouterProps {
  user: any;
}



const RoleRouter: React.FC<RoleRouterProps> = ({ user }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch user attributes
        const fetchedAttributes = await fetchUserAttributes();
        //console.log(fetchedAttributes)
        

        // Check user role
        const isOwner = await checkIsOwner(fetchedAttributes);

        if (isOwner) {
          console.log('Owner')
          router.push('/members/owner');
        } else {
          console.log('Not Owner')
          router.push('/members/cbo');
        }
      } catch (error) {
        console.error('Error fetching user details or role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [user?.username, router]);

  if (isLoading) {
    return <MemberLoadingScreen />;
  }

  return (
    <div className="flex flex-col justify-center items-center pt-20">
      <p>Loading Homepage for {user?.username}...</p>
    </div>
  );
};

export default RoleRouter;

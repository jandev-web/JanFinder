'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use useRouter from next/navigation
import checkUserRole from '@/utils/checkOwnerStatus';
import MemberLoadingScreen from '@/components/pages/MemberPageLoading';

interface RoleRouterProps {
  user: any;
}

const RoleRouter: React.FC<RoleRouterProps> = ({ user }) => {
  const router = useRouter();


  console.log(user)
  
  // State for loading and role
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const isOwner = await checkUserRole(user?.username);
        if (isOwner === true) {
          
          router.push('/members/owner');
        } else if (isOwner === false) {
          
          router.push('/members/cbo');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
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

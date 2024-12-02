'use client';

import React, { useState } from 'react';
import { useUser } from '@/components/UserContext'; // Import the useUser hook
import EditOwnerProfileComponent from '@/components/pages/EditOwnerProfile'
import OwnerHeader from '@/components/OwnerHeader'
const ProfilePage: React.FC = () => {
  const { attributes } = useUser(); // Access the user from the context
  const user = attributes
  const [isLoading, setIsLoading] = useState(false);
  
  
  if (isLoading) {
    return <div>Loading...</div>; // Optionally display a loading state
  }
  return (
    <div className="flex w-full flex-col min-h-screen">
     
      
        <OwnerHeader user={user} />
      

      
      
        <EditOwnerProfileComponent user={user} />
      
    </div>
  );
};

export default ProfilePage;

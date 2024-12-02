'use client';

import React, { useState } from 'react';
import { useUser } from '@/components/UserContext'; // Import the useUser hook
import OwnerProfilePage from '@/components/pages/OwnerProfilePage'
import OwnerHeader from '@/components/OwnerHeader'
const ProfilePage: React.FC = () => {
  const { attributes } = useUser(); // Access the user from the context
  const user = attributes
  
  return (
    <div className="flex w-full flex-col min-h-screen">
     
      
        <OwnerHeader user={user} />
      

      
      
        <OwnerProfilePage user={user} />
      
    </div>
  );
};

export default ProfilePage;

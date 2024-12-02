'use client';

import React, { useState } from 'react';
import { useUser } from '@/components/UserContext'; // Import the useUser hook
import ProfilePageComponent from '@/components/pages/ProfilePageComponent'
import CBOHeader from '@/components/CBOHeader'
import { useRouter } from 'next/navigation';

const ProfilePage: React.FC = () => {
  const { attributes } = useUser(); // Access the user from the context
  const user = attributes
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  if (isLoading) {
    return <div>Loading...</div>; // Optionally display a loading state
  }
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">

      <div className="w-full pb-12">
        <CBOHeader user={user} />
      </div>

      


      <ProfilePageComponent user={user} />

    </div>
  );
};

export default ProfilePage;

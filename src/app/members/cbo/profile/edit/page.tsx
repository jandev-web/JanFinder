'use client';

import React, { useState } from 'react';
import { useUser } from '@/components/UserContext'; // Import the useUser hook
import EditProfileComponent from '@/components/pages/EditProfileComponent'
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

      <div className="w-full flex justify-start mt-6 ml-6 mb-0 pb-0"> {/* Positioned below the header */}
        <button
          className="text-green-600 hover:text-yellow-400 transition"
          onClick={() => router.push('/members/cbo/profile')}
        >
          &lt; Back to Profile
        </button>

      </div>


      <EditProfileComponent user={user} />

    </div>
  );
};

export default ProfilePage;

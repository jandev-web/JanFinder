import React from 'react';
import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";
import ProfilePageComponent from '@/components/pages/ProfilePageComponent';
import CBOHeader from '@/components/CBOHeader';
import { redirect } from 'next/navigation';

const ProfilePage = async () => {
  try {
    const user = await AuthGetCurrentUserServer();

    // Redirect to login if no user is found
    if (!user) {
      redirect('/login');
    }

    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
        <div className="w-full pb-12">
          <CBOHeader user={user} />
        </div>
        <ProfilePageComponent user={user} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Redirect to login on error
    redirect('/login');
  }
};

export default ProfilePage;

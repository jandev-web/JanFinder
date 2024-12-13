import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import AllCBOs from '@/components/pages/AllCBOs';
import OwnerHeader from '@/components/OwnerHeader';
import { userAgent } from 'next/server';

export default async function CBOListPage() {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/login');
    }

    // Render the CBOListPage content with the user's data
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="pt-10">
          <OwnerHeader user={userAgent} />
        </div>
        <div className="flex-1 flex pt-10">
          <AllCBOs user={user} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Redirect to the login page if there's an error
    redirect('/login');
  }
}

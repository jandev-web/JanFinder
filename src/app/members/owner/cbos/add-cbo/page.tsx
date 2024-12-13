import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import CreateCBOForm from '@/components/pages/AddCBO';
import OwnerHeader from '@/components/OwnerHeader';

export default async function CBOListPage() {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/login');
    }

    // Render the page content with the authenticated user
    return (
      <div className="flex w-full flex-col min-h-screen bg-gray-100">
        {/* Header */}
        <OwnerHeader user={user} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen w-full justify-center items-start pt-14">
          <CreateCBOForm user={user} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Redirect to the login page if an error occurs
    redirect('/login');
  }
}

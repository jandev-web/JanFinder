import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import EditOwnerProfileComponent from '@/components/pages/EditOwnerProfile';
import OwnerHeader from '@/components/OwnerHeader';

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/login');
    }

    // Render the page content with the authenticated user
    return (
      <div className="flex w-full flex-col min-h-screen">
        {/* Header */}
        <OwnerHeader user={user} />

        {/* Main Content */}
        <EditOwnerProfileComponent user={user} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Redirect to the login page if an error occurs
    redirect('/login');
  }
}

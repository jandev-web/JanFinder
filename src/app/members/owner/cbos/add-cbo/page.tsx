import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import AddCBOPage from '@/components/pages/OwnerAddCBOPage';
import OwnerHeader from '@/components/OwnerHeader';

export const dynamic = "force-dynamic";

export default async function OwnerAddCBO() {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/members/sign-in');
    }

    // Render the page content with the authenticated user
    return (
      <div className="flex w-full flex-col min-h-screen bg-gray-100">
        <AddCBOPage user={user} />
      </div>

    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Redirect to the login page if an error occurs
    redirect('/login');
  }
}

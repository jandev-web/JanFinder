import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import OwnerHeader from '@/components/OwnerHeader';
import FranchisePage from '@/components/pages/FranchisePage';

export default async function OwnerFranchisePage() {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/login');
    }

    // Render the page content with the authenticated user
    return (
      <div className="min-h-screen bg-gray-100">
        <OwnerHeader user={user} />
        <div className="pt-14">
          <FranchisePage user={user} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Redirect to the login page if an error occurs
    redirect('/login');
  }
}

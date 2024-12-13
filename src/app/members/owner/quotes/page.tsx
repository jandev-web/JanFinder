import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';

import OwnerHeader from '@/components/OwnerHeader';
import AllQuotes from '@/components/pages/AllQuotes';






export default async function AllQuotesPage() {
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
        <AllQuotes user={user} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Redirect to the login page if an error occurs
    redirect('/login');
  }
}


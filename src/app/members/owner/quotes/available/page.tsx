import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import OwnerHeader from '@/components/OwnerHeader';
import OwnerAvaQuotes from '@/components/OwnerAvailableQuotes';

export default async function AvaQuotesPage() {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/login');
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Render Header */}
        <div className="pt-10">
          <OwnerHeader user={user} />
        </div>

        {/* Render Available Quotes */}
        <div className="flex-1 flex pt-10">
          <OwnerAvaQuotes user={user} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Redirect to login if an error occurs
    redirect('/login');
  }
}

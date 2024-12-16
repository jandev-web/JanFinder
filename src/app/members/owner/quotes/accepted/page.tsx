
import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import OwnerAccQuotes from '@/components/OwnerAcceptedQuotes'
import OwnerHeader from '@/components/OwnerHeader';

export const dynamic = "force-dynamic";

export default async function AllQuotesPage() {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/login');
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="pt-10">
          <OwnerHeader user={user} />
        </div>
        <div className="flex-1 flex pt-10">
          <OwnerAccQuotes user={user} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Redirect to login if an error occurs
    redirect('/login');
  }
}

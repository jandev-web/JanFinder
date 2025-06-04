
import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import OwnerAcceptedQuotesPage from '@/components/pages/OwnerAccQuotesPage';
import LoginError from '@/components/LoginErrorComponent';

export const dynamic = "force-dynamic";

export default async function AcceptedQuotesPage() {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/login');
    }

    return (
      <div className="flex w-full flex-col min-h-screen">
        <OwnerAcceptedQuotesPage user={user} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

  }
}

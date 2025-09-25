
import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import FranchiseQuotesPage from '@/components/pages/FranchiseQuotesPage';
import LoginError from '@/components/LoginErrorComponent';

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
      <div className="flex w-full flex-col min-h-screen">
        <FranchiseQuotesPage user={user} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Redirect to the login page if an error occurs
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }
}

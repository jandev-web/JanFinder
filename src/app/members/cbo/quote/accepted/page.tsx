import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import CBOSingleAcceptedQuote from '@/components/pages/CBOAcceptedQuote';
import LoginError from '@/components/LoginErrorComponent';

export const dynamic = "force-dynamic";

export default async function AcceptedQuotePage({ searchParams }: { searchParams: { id?: string } }) {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/login');
    }

    const quoteParam = searchParams?.id || null;

    return (
      <div className="flex w-full flex-col min-h-screen">
        <CBOSingleAcceptedQuote user={user} quoteID={quoteParam} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Redirect to login if an error occurs
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }
}

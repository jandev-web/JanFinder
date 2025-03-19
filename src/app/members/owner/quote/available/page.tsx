import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import OwnerSingleAvailableQuote from '@/components/pages/OwnerAvailableQuote';
import LoginError from '@/components/LoginErrorComponent';

export const dynamic = "force-dynamic";

export default async function AvailableQuotePage({ searchParams }: { searchParams: { quoteID?: string } }) {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/login');
    }

    const quoteParam = searchParams?.quoteID || null;

    return (
      <div className="flex w-full flex-col min-h-screen">
        <OwnerSingleAvailableQuote user={user} quoteID={quoteParam} />
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

import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import OwnerQuote from '@/components/pages/SingleOwnerQuoteAvailable';
import OwnerHeader from '@/components/OwnerHeader';
import OwnerSingleQuote from '@/components/pages/OwnerSingleQuotePage';
export const dynamic = "force-dynamic";


export default async function SingleOwnerQuotePage({ searchParams }: { searchParams: { quoteID?: string; page?: string } }) {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/login');
    }

    const quoteParam = searchParams?.quoteID || null;
    const prevPage = searchParams?.page || null;

    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
        
          <OwnerSingleQuote user={user} quoteID={quoteParam} prevPage={prevPage} />
        
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Redirect to login if an error occurs
    redirect('/login');
  }
}

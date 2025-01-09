import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import MemberStartQuoteDetailsPage from '@/components/pages/MemberStartQuoteDetailsPage';
import LoadingSpinner from '@/components/loadingScreen';
import LoginError from '@/components/LoginErrorComponent';

export const dynamic = "force-dynamic";

export default async function AllQuotesPage() {
  try {
    const user = await AuthGetCurrentUserServer();

    if (!user) {
      redirect('/login');
    }

    const isOwner = user
    //attributes.['custom:isOwner'] === 'true';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
       <MemberStartQuoteDetailsPage user={user} />
      </div>
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }
}

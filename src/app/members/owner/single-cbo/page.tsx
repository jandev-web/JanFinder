import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import OneCBO from '@/components/pages/OwnerSingleCBOPage';

export const dynamic = "force-dynamic";

export default async function CBOPage() {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/members/sign-in');
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <OneCBO user={user} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Redirect to login if an error occurs
    redirect('/members/sign-in');
  }
}

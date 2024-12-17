import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import Owner from '@/components/pages/Owner';
import LoginError from '@/components/LoginErrorComponent';

export const dynamic = "force-dynamic";

export default async function OwnerLanding() {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/members/sign-in');
    }

    // Render the Owner component with the user's data
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Owner user={user} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Handle errors by showing a login error component
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }
}

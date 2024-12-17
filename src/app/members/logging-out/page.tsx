import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import LoggingOut from '@/components/pages/LoggingOut';

export const dynamic = "force-dynamic";

export default async function FranchiseListPage() {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/members/sign-in');
    }

    // Pass the user's attributes to the LoggingOut component
    return (
      <div>
        <LoggingOut />
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Handle errors by redirecting to the login page
    redirect('/members/sign-in');
  }
}

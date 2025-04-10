
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';
import LoginError from '@/components/LoginErrorComponent';

import '@aws-amplify/ui-react/styles.css'; // Ensure the styles are imported
import CBO from '@/components/pages/CBO';
import MemberLoadingScreen from '@/components/pages/MemberPageLoading';

import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";

export const dynamic = "force-dynamic";



export default async function CBOPage() {
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
        <CBO user={user} />
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

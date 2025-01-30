import React from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import RouteSignInUser from '@/components/RouteSignInUser';

export const dynamic = "force-dynamic";


export default async function Home() {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();
    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/members/sign-in');
    }

     // Get the authenticated user

    // Render the page with the authenticated user's data
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full">
          <RouteSignInUser user={user}/>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Handle any errors by redirecting to an error page or login
    //redirect('/members/sign-in');
  }
}
import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import OwnerCBOPage from '@/components/pages/OwnerCBOPage'

export const dynamic = "force-dynamic";

export default async function CBOListPage() {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to the login page if the user is not authenticated
    if (!user) {
      redirect('/member/sign-in');
    }

    // Render the CBOListPage content with the user's data
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <OwnerCBOPage user={user} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Redirect to the login page if there's an error
    //redirect('/login');
  }
}

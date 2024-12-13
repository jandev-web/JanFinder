import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import SubscriptionPage from '@/components/pages/Subscribe';
import OwnerHeader from '@/components/OwnerHeader';

export default async function OwnerSubscribePage() {
  try {
    const user = await AuthGetCurrentUserServer();

    if (!user) {
      redirect('/login');
    }

    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
        <div className="w-full pb-12">
          <OwnerHeader user={user} />
        </div>
        <div className="w-full flex flex-col items-center mt-10">
          <SubscriptionPage user={user} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    redirect('/login');
  }
}

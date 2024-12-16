import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import OwnerSubscription from '@/components/pages/OwnerSubscriptionPage';
import OwnerHeader from '@/components/OwnerHeader';

export const dynamic = "force-dynamic";

export default async function OwnerSubPage() {
  try {
    const user = await AuthGetCurrentUserServer();

    if (!user) {
      redirect('/login');
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="pt-10">
          <OwnerHeader user={user} />
        </div>
        <div className="flex-1 flex pt-10">
          <OwnerSubscription user={user} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    redirect('/login');
  }
}

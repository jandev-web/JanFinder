import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import OwnerHeader from '@/components/OwnerHeader';
import MemberStartQuotePage from '@/components/pages/MemberStartQuotePage';

export const dynamic = "force-dynamic";

export default async function StartQuotePage() {
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
          <MemberStartQuotePage user={user} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    redirect('/login');
  }
}

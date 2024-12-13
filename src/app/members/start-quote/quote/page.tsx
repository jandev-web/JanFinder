import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import CBOBuildingData from '@/components/pages/CBOBuildingData';
import LoadingSpinner from '@/components/loadingScreen';
import OwnerHeader from '@/components/OwnerHeader';
import CBOHeader from '@/components/CBOHeader';

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
        <div className="pt-10">
          {isOwner ? <OwnerHeader user={user} /> : <CBOHeader user={user} />}
        </div>
        <div className="flex-1 flex pt-10">
          <CBOBuildingData user={user} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    redirect('/login');
  }
}

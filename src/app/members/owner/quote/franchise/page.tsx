import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import LoginError from '@/components/LoginErrorComponent';

export const dynamic = 'force-dynamic';

type SP = { quoteID?: string | string[] };

export default async function AvailableQuotePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  try {
    // Await Next 15's promised searchParams
    const sp = await searchParams;
    const rawId = sp?.quoteID;
    const quoteParam = Array.isArray(rawId) ? rawId[0] : rawId ?? null;

    // Auth on the server
    const user = await AuthGetCurrentUserServer();
    if (!user) {
      redirect('/login'); // throws
    }

    // If this page requires an id, guard here (optional)
    if (!quoteParam) {
      redirect('/members'); // or wherever makes sense in your app
    }

    return (
      <div className="flex w-full flex-col min-h-screen">
      </div>
    );
  } catch (error) {
    console.error('Error fetching user or search params:', error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }
}

import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import CBOSingleAvailableQuote from '@/components/pages/CBOAvailableQuote';
import LoginError from '@/components/LoginErrorComponent';

export const dynamic = 'force-dynamic';

type SP = { id?: string | string[] };

export default async function AvailableQuotePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  try {
    // Await Next 15's promised searchParams
    const sp = await searchParams;
    const rawId = sp?.id;
    const quoteParam = Array.isArray(rawId) ? rawId[0] : rawId ?? null;

    // Server-side auth
    const user = await AuthGetCurrentUserServer();
    if (!user) {
      redirect('/login'); // throws
    }

    return (
      <div className="flex w-full flex-col min-h-screen">
        <CBOSingleAvailableQuote user={user} requestID={quoteParam} />
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

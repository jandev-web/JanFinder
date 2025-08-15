import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import CBOSingleAcceptedQuote from '@/components/pages/CBOAcceptedQuote';
import LoginError from '@/components/LoginErrorComponent';

export const dynamic = 'force-dynamic';

type SP = { id?: string | string[] };

export default async function AcceptedQuotePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  try {
    // 1) Await Next 15's promised searchParams
    const sp = await searchParams;
    const rawId = sp?.id;
    const quoteParam = Array.isArray(rawId) ? rawId[0] : rawId ?? null;

    // 2) Auth on the server
    const user = await AuthGetCurrentUserServer();
    if (!user) {
      redirect('/login'); // throws; no return needed
    }

    return (
      <div className="flex w-full flex-col min-h-screen">
        <CBOSingleAcceptedQuote user={user} quoteID={quoteParam} />
      </div>
    );
  } catch (error) {
    console.error('Error in AcceptedQuotePage:', error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }
}

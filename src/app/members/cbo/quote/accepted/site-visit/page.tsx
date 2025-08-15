import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import CBOSingleAcceptedQuote from '@/components/pages/CBOAcceptedQuote';
import LoginError from '@/components/LoginErrorComponent';
import SiteVistForm from '@/components/pages/SiteVisitForm'; // see note below

export const dynamic = 'force-dynamic';

type SP = { id?: string | string[] };

export default async function AcceptedQuotePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  try {
    // Await Next 15's promised searchParams
    const sp = await searchParams;
    const rawId = sp?.id;
    const quoteParam = Array.isArray(rawId) ? rawId[0] : rawId ?? null;

    // Auth on the server
    const user = await AuthGetCurrentUserServer();
    if (!user) {
      redirect('/login'); // throws
    }

    // Optional: if you require an id, guard here
    // if (!quoteParam) redirect('/members'); // or show an error component

    return (
      <div className="flex w-full flex-col min-h-screen">
        <SiteVistForm user={user} quoteID={quoteParam} />
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

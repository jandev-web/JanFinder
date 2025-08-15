import React from 'react';
import '@aws-amplify/ui-react/styles.css';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import CBOQuote from '@/components/pages/SingleCBOQuotePage';
import CBOHeader from '@/components/CBOHeader';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

type SP = { quoteID?: string | string[]; page?: string | string[] };

export default async function SingleCBOQuotePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  // Await Next 15's promised searchParams
  const sp = await searchParams;
  const rawQuote = sp?.quoteID;
  const rawPage = sp?.page;

  const quoteParam = Array.isArray(rawQuote) ? rawQuote[0] : rawQuote ?? '';
  const prevPage = Array.isArray(rawPage) ? rawPage[0] : rawPage ?? '';

  // Server-side auth
  const user = await AuthGetCurrentUserServer();
  if (!user) {
    redirect('/login'); // throws
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Header Section */}
      <div className="pt-10">
        <CBOHeader user={user} />
      </div>

      {/* Quote Section */}
      <div className="flex-1 flex pt-10">
        <CBOQuote user={user} quoteID={quoteParam} prevPage={prevPage} />
      </div>
    </div>
  );
}

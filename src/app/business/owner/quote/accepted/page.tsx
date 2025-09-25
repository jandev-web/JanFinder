import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import { createServerDataClient } from '@/utils/data-server';

import OwnerQuoteClient from '@/components/pages/OwnerSingleAcceptedQuotePage';
import OwnerFooter from '@/components/OwnerFooter';
import getQuotePDF from '@/utils/getQuotePDF';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;
export const dynamic = 'force-dynamic';

type SP = { quoteID?: string | string[] };

export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  // 1) auth
  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
  });
  if (!authUser) redirect('/business/sign-in');

  // 2) read quoteID from query
  const sp = await searchParams;
  const raw = sp?.quoteID;
  const quoteID = Array.isArray(raw) ? raw[0] : raw ?? '';
  if (!quoteID) redirect('/error');

  // 3) fetch owner
  const client = createServerDataClient(cookies);
  const ownerRes = await client.queries.getOwnerById({ id: authUser.userId }, { authMode: 'userPool' });
  if (ownerRes.errors?.length) redirect('/error');
  const owner = typeof ownerRes.data === 'string' ? JSON.parse(ownerRes.data) : ownerRes.data;

  const userID: string | undefined =
    owner?.data?.OwnerID ?? owner?.OwnerID ?? owner?.id ?? authUser.userId;

  const franchiseID: string | undefined =
    owner?.data?.FranchiseID ?? owner?.franchiseId ?? owner?.franchiseID;

  if (!userID || !franchiseID) redirect('/error');

  // 4) fetch quote
  const quoteRes = await client.queries.getQuote({ quoteID }, { authMode: 'userPool' });
  if (quoteRes.errors?.length) redirect('/error');
  const quoteData = typeof quoteRes.data === 'string' ? JSON.parse(quoteRes.data) : quoteRes.data;
  const initialQuote = quoteData?.quote ?? quoteData ?? null;

  // 5) zero-arg server action that calls the server util getQuotePDF
  const getQuotePdfAction = async () => {
    'use server';
    return await getQuotePDF(quoteID);
  };

  return (
    <div className="flex w-full flex-col min-h-screen">
      <OwnerQuoteClient
        initialQuote={initialQuote}
        getQuotePdfAction={getQuotePdfAction}
      />
      <OwnerFooter />
    </div>
  );
}

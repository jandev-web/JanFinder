// app/members/owner/quote/sell/page.tsx
import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import { createServerDataClient } from '@/utils/data-server';



import OwnerSellQuoteClient from '@/components/pages/OwnerSellQuotePage';
import OwnerFooter from '@/components/OwnerFooter';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;
export const dynamic = 'force-dynamic';

type SP = { quoteID?: string | string[] };

export default async function SellQuotePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
  });
  if (!authUser) redirect('/members/sign-in');

  const sp = await searchParams;
  const rawId = sp?.quoteID;
  const quoteID = Array.isArray(rawId) ? rawId[0] : rawId ?? null;
  if (!quoteID) redirect('/error');

  const client = createServerDataClient(cookies);
  const ownerRes = await client.queries.getOwnerById({ id: authUser.userId }, { authMode: 'userPool' });
  if (ownerRes.errors?.length) redirect('/error');
  const owner = typeof ownerRes.data === 'string' ? JSON.parse(ownerRes.data) : ownerRes.data;

  const userID: string | undefined =
    owner?.data?.OwnerID ?? owner?.OwnerID ?? owner?.id ?? authUser.userId;

  const franchiseID: string | undefined =
    owner?.data?.FranchiseID ?? owner?.franchiseId ?? owner?.franchiseID;

  if (!userID || !franchiseID) redirect('/error');

  const quoteRes = await client.queries.getQuote({ quoteID }, { authMode: 'userPool' });
  if (quoteRes.errors?.length) redirect('/error');
  const quoteData = typeof quoteRes.data === 'string' ? JSON.parse(quoteRes.data) : quoteRes.data;
  const initialQuote = quoteData?.quote ?? quoteData ?? null;

  const membersRes = await client.queries.ownerGetAllMembers(
    { ownerID: userID },
    { authMode: 'userPool' }
  );
  if (membersRes.errors?.length) redirect('/error');

  const membersPayload =
    typeof membersRes.data === 'string' ? JSON.parse(membersRes.data) : membersRes.data;
  const franchiseMembers = membersPayload?.members ?? membersPayload?.items ?? [];
  const reqRes = await client.queries.getPendingSellRequests(
    { ownerID: userID, quoteID },
    { authMode: 'userPool' }
  );
  if (reqRes.errors?.length) redirect('/error');

  const reqPayload =
    typeof reqRes.data === 'string' ? JSON.parse(reqRes.data) : reqRes.data;
  const pendingRequests = reqPayload?.requests ?? [];

  async function sellQuoteAction(form: { quoteID: string; targetUser: string; ownerID: string }) {
    'use server';
    const { quoteID, targetUser, ownerID } = form;
    if (!quoteID || !targetUser || !ownerID) {
      throw new Error('Missing required fields.');
    }
    const serverClient = createServerDataClient(cookies);
    const { data, errors } = await serverClient.mutations.sendTransferRequest(
      { quoteID, ownerID, targetUser },
      { authMode: 'userPool' }
    );
    if (errors?.length) {
      throw new Error(errors.map(e => e.message).join('; '));
    }
    return typeof data === 'string' ? JSON.parse(data) : data;
  }

  return (
    <OwnerSellQuoteClient
      owner={owner}
      quoteID={quoteID}
      initialMembers={franchiseMembers ?? []}
      initialRequests={pendingRequests}            
      sellQuoteAction={sellQuoteAction}
    />
  )
}
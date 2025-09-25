// app/business/owner/available-quotes/page.tsx
// src/app/business/owner/page.tsx
import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import BiddingPage from '@/components/pages/BiddingPage';
import { createServerDataClient } from '@/utils/data-server';
import { cookies } from 'next/headers';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const client = createServerDataClient(cookies);
  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
  });

  if (!authUser) {
    redirect('/business/sign-in');
  }

  const ownerRes = await client.queries.getOwnerById(
    { id: authUser.userId },
    { authMode: 'userPool' }
  );
  if (ownerRes.errors?.length) {
    console.log(ownerRes.errors); 
    //redirect('/error');
  }
  const ownerData = typeof ownerRes.data === 'string' ? JSON.parse(ownerRes.data) : ownerRes.data;

  const userID: string | undefined =
    ownerData?.data?.OwnerID ?? ownerData?.OwnerID ?? ownerData?.id ?? authUser.userId;

  const franchiseID: string | undefined =
    ownerData?.data?.FranchiseID ?? ownerData?.franchiseId ?? ownerData?.franchiseID;

  if (!userID || !franchiseID) {
    console.log('Missing userID or franchiseID');
    redirect('/error');
  }

  const franchiseRes = await client.queries.getFranchiseInfo(
    { franchiseID },
    { authMode: 'userPool' }
  );
  if (franchiseRes.errors?.length) {
    console.log(franchiseRes.errors);
    //redirect('/error');
  } 
  const franchiseData =
    typeof franchiseRes.data === 'string' ? JSON.parse(franchiseRes.data) : franchiseRes.data;


  const availableRes = await client.queries.getAvailableQuotesOwner(
    { authMode: 'userPool' }
  );
  if (availableRes.errors?.length) {
    console.log(availableRes.errors);
    //redirect('/error');
  }
  const availablePayload =
    typeof availableRes.data === 'string' ? JSON.parse(availableRes.data) : availableRes.data;
  const availableQuotes = Array.isArray(availablePayload) ? availablePayload : [];

  // --- ACCEPTED QUOTES (owner + franchise split) ---
  const acceptedRes = await client.queries.getAcceptedQuotesOwner(
    { franchiseID, ownerID: userID },
    { authMode: 'userPool' }
  );
  if (acceptedRes.errors?.length) {
    console.log(acceptedRes.errors);
    //redirect('/error');
  }
  const acceptedPayload =
    typeof acceptedRes.data === 'string' ? JSON.parse(acceptedRes.data) : acceptedRes.data;
  const ownerQuotes = Array.isArray(acceptedPayload?.ownerQuotes) ? acceptedPayload.ownerQuotes : [];
  const franchiseQuotes = Array.isArray(acceptedPayload?.franchiseQuotes) ? acceptedPayload.franchiseQuotes : [];

  return <BiddingPage availableQuotes={availableQuotes}/>;
}

import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import { createServerDataClient } from '@/utils/data-server';
import FranchiseMembersClient from '@/components/pages/FranchiseMembersClient';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;
export const dynamic = "force-dynamic";

export default async function CBOListPage() {
  try {
    const authUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
    });
    if (!authUser) redirect('/members/sign-in');

    const client = createServerDataClient(cookies);
    const ownerRes = await client.queries.getOwnerById({ id: authUser.userId }, { authMode: 'userPool' });
    if (ownerRes.errors?.length) redirect('/error');
    const owner = typeof ownerRes.data === 'string' ? JSON.parse(ownerRes.data) : ownerRes.data;

    const userID: string | undefined =
      owner?.data?.OwnerID ?? owner?.OwnerID ?? owner?.id ?? authUser.userId;

    const franchiseID: string | undefined =
      owner?.data?.FranchiseID ?? owner?.franchiseId ?? owner?.franchiseID;

    if (!userID || !franchiseID) redirect('/error');
    const membersRes = await client.queries.ownerGetAllMembers(
      { ownerID: userID },
      { authMode: 'userPool' }
    );
    if (membersRes.errors?.length) redirect('/error');

    const membersPayload =
      typeof membersRes.data === 'string' ? JSON.parse(membersRes.data) : membersRes.data;
    const franchiseMembers = membersPayload?.members ?? membersPayload?.items ?? [];
    console.log(franchiseMembers);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <FranchiseMembersClient members={franchiseMembers} addHref="/members/owner/cbos/add-cbo" />
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);


  }
}

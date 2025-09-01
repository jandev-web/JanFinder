import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';

import { getOwnerByIdServer } from '@/utils/getOwnerByIdServer';
import { getFranchiseServer } from '@/utils/getFranchiseServer';
import { getAcceptedQuotesServer } from '@/utils/getAcceptedOwnerQuotesServer';

import OwnerAcceptedQuotesPage from '@/components/pages/OwnerAcceptedQuotesPage';
import LoginError from '@/components/LoginErrorComponent';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;
export const dynamic = 'force-dynamic';

export default async function Page() {
  // Auth (server)
  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
  });
  if (!authUser) redirect('/members/sign-in');

  // Owner (server)
  const owner = await getOwnerByIdServer(authUser.userId);
  if (!owner) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }

  // Franchise ID (normalize possible field names)
  const ownerID = (owner as any)?.id ?? (owner as any)?.OwnerID;
  const franchiseID: string | undefined = (owner as any)?.franchiseId ?? (owner as any)?.franchiseID ?? undefined;

  // Accepted quotes for this franchise
  const quotes = ownerID && franchiseID
    ? await getAcceptedQuotesServer(franchiseID, ownerID)
    : [];

  // Franchise info (optional)
  const franchise = franchiseID ? await getFranchiseServer(franchiseID) : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <OwnerAcceptedQuotesPage ownerData={owner} quotes={quotes} franchise={franchise} />
    </div>
  );
}

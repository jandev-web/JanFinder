// app/members/owner/available-quotes/page.tsx
import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';

import { getOwnerByIdServer } from '@/utils/getOwnerByIdServer';
import { getAvailableQuotesServer } from '@/utils/getAvailableOwnerQuotesServer';
import { getFranchiseServer } from '@/utils/getFranchiseServer';

import OwnerAvaQuotesPage from '@/components/pages/OwnerAvailableQuotesPage';
import LoginError from '@/components/LoginErrorComponent';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;

export const dynamic = 'force-dynamic';

export default async function AvaQuotesPage() {
  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
  });

  if (!authUser) {
    redirect('/members/sign-in');
  }

  const ownerData = await getOwnerByIdServer(authUser.userId);

  if (!ownerData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }

  const franchiseId = (ownerData.franchiseId) as string | undefined;

  const [quotes, franchise] = await Promise.all([
    authUser.userId ? getAvailableQuotesServer(authUser.userId) : Promise.resolve([]),
    franchiseId ? getFranchiseServer(franchiseId) : Promise.resolve(null),
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <OwnerAvaQuotesPage
        ownerData={ownerData}
        quotes={quotes}
        franchise={franchise}
      />
    </div>
  );
}


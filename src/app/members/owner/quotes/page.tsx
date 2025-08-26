import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import OwnerAllQuotesPage from '@/components/pages/OwnerAllQuotes';
import LoginError from '@/components/LoginErrorComponent';
import { getOwnerByIdServer } from '@/utils/getOwnerByIdServer';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;

export const dynamic = "force-dynamic";

export default async function AllQuotesPage() {
  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
  });

  if (!authUser) {
    redirect('/members/sign-in');
  }

  console.log(authUser.userId);

  const ownerData = await getOwnerByIdServer(authUser.userId);

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <OwnerAllQuotesPage user={ownerData} />
    </div>
  );
}



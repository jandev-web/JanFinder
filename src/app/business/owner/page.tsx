// src/app/business/owner/page.tsx
import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import Owner from '@/components/pages/Owner';
import LoginError from '@/components/LoginErrorComponent';
import { getOwnerByIdServer } from '@/utils/getOwnerByIdServer';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;

export const dynamic = 'force-dynamic';

export default async function OwnerLanding() {
  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
  });

  if (!authUser) {
    redirect('/business/sign-in');
  }

  const ownerData = await getOwnerByIdServer(authUser.userId);

  if (!ownerData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }

  return (
    <Owner ownerData={ownerData} />
      
    
  );
}

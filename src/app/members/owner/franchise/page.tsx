import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';

import { getOwnerByIdServer } from '@/utils/getOwnerByIdServer';
import { getFranchiseServer } from '@/utils/getFranchiseServer';

import FranchisePage from '@/components/pages/CBOFranchisePage';
import LoginError from '@/components/LoginErrorComponent';

export const dynamic = 'force-dynamic';

export default async function Page() {
  // 1) Auth on the server
  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null),
  });

  if (!authUser) {
    redirect('/members/sign-in');
  }

  // 2) Fetch owner on the server
  const owner = await getOwnerByIdServer(authUser.userId);
  if (!owner) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }

  // 3) Fetch franchise on the server (handle camelCase vs. Pascal case)
  const franchiseID = owner.franchiseId
  const franchise = franchiseID ? await getFranchiseServer(franchiseID) : null;

  // 4) Pass everything to a small client renderer
  return <FranchisePage owner={owner} franchise={franchise} />;
}

// app/business/owner/franchise/edit-template/contract/page.tsx
import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';

import { setFranchiseTemplateAction } from '@/utils/setFranchiseTemplatesServer';
import { getOwnerByIdServer } from '@/utils/getOwnerByIdServer';
import { getFranchiseServer } from '@/utils/getFranchiseServer';
import deleteFranchiseContractTemplateServer from '@/utils/deleteFranchiseContractTemplateServer';
import FranchiseEditContractClient from '@/components/pages/EditFranchiseContractClient';

import LoginError from '@/components/LoginErrorComponent';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;

export const dynamic = 'force-dynamic';

export default async function Page() {
  // Auth (server)
  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
  });

  if (!authUser) {
    redirect('/business/sign-in');
  }

  // Owner (server)
  const owner = await getOwnerByIdServer(authUser.userId);
  if (!owner) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }

  // Franchise (server)
  const franchiseId = owner.franchiseId;
  const franchise = franchiseId ? await getFranchiseServer(franchiseId) : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <FranchiseEditContractClient owner={owner} franchise={franchise} setTemplate={setFranchiseTemplateAction} deleteTemplateAndUnset={deleteFranchiseContractTemplateServer} />
    </div>
  );
}

// app/members/owner/franchise/page.tsx
import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';

import { getOwnerByIdServer } from '@/utils/getOwnerByIdServer';
import { getFranchiseServer } from '@/utils/getFranchiseServer';

import FranchiseClient from '@/components/pages/FranchiseClient';
import LoginError from '@/components/LoginErrorComponent';
import deleteFranchise from '@/utils/deleteFranchise';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;

export const dynamic = 'force-dynamic';

// Optional server action: pass to FranchiseClient if it renders a delete form
async function deleteFranchiseAction(formData: FormData) {
  'use server';

  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
  });
  if (!authUser) {
    redirect('/members/sign-in');
  }

  const ownerID = formData.get('ownerID') as string | null;
  if (!ownerID) throw new Error('Missing ownerID');

  await deleteFranchise(ownerID);
  redirect('/members/logging-out');
}

export default async function FranchisePage() {
  // Auth (server)
  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
  });

  if (!authUser) {
    redirect('/members/sign-in');
  }

  // Owner (server)
  const ownerData = await getOwnerByIdServer(authUser.userId);
  if (!ownerData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }

  // Franchise (server) — NOTE: await the call, and no `.data`
  const franchiseId = ownerData.franchiseId as string | undefined;
  const franchise = franchiseId ? await getFranchiseServer(franchiseId) : null;
  console.log('franchise', franchise);
  // If your client page expects these; otherwise you can omit
  const ownerID = (ownerData as any)?.OwnerID ?? (ownerData as any)?.ownerID ?? (ownerData as any)?.id ?? '';
  
  // If you don't need delete, remove onDelete prop and the server action above
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <FranchiseClient
        owner={ownerData}
        franchise={franchise}
        ownerID={ownerID}
        // If your client supports download links, compute them server-side and pass here.
        // For now, keep them null to match the "works like available-quotes" simplicity.
        quoteTemplate={null}
        contractTemplate={null}
        onDelete={deleteFranchiseAction}
      />
    </div>
  );
}

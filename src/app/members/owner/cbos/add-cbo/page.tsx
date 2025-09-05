// app/members/owner/cbos/add-cbo/page.tsx

import 'server-only';
import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import { createServerDataClient } from '@/utils/data-server';
import AddCBOEmailForm, { type ActionState } from '@/components/pages/AddCBOEmailForm';

export const dynamic = 'force-dynamic';
type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;

export default async function AddCBOEmailPage() {
  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
  });
  if (!authUser) redirect('/members/sign-in');

  const pre = createServerDataClient(cookies);
  const ownerRes = await pre.queries.getOwnerById({ id: authUser.userId }, { authMode: 'userPool' });
  if (ownerRes.errors?.length) redirect('/error');
  const owner = typeof ownerRes.data === 'string' ? JSON.parse(ownerRes.data) : ownerRes.data;

  const userID: string = owner?.data?.OwnerID ?? owner?.OwnerID ?? owner?.id ?? authUser.userId;
  const franchiseIDFallback: string = owner?.data?.FranchiseID ?? owner?.franchiseId ?? owner?.franchiseID ?? userID;

  async function inviteCBO(franchiseID: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
    'use server';
    const client = createServerDataClient(cookies);
    const email = (formData.get('email') ?? '').toString().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) {
      return { ok: false, error: 'Please enter a valid email.' };
    }
    const { errors } = await client.mutations.ownerInviteCBO({ franchiseID, email }, { authMode: 'userPool' });
    if (errors?.length) return { ok: false, error: errors[0].message ?? 'Failed to send invite.' };
    return { ok: true, error: null };
  }

  const boundAction = inviteCBO.bind(null, franchiseIDFallback) as (prev: ActionState, formData: FormData) => Promise<ActionState>;

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-lg px-6 py-10">
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
          <div className="border-b px-6 py-5">
            <h1 className="text-2xl font-semibold tracking-tight">Invite a Franchise Member</h1>
            <p className="mt-1 text-sm text-gray-600">We’ll email them a secure link to sign up.</p>
          </div>
          <AddCBOEmailForm action={boundAction} />
        </div>
      </div>
    </div>
  );
}

//TODO: add a check that if franchise status is complete and not pending, this page auto redirects back to mambers/owner/home
import 'server-only';
import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import { createServerDataClient } from '@/utils/data-server';
import SetupForm, { type ActionState } from '@/components/pages/FranchiseSetUpPage';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;
export const dynamic = 'force-dynamic';

const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY',
  'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH',
  'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default async function FranchiseSetupPage() {
  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
  });
  if (!authUser) redirect('/members/sign-in');

  // Preload owner record (render-time)
  const preClient = createServerDataClient(cookies);
  const ownerRes = await preClient.queries.getOwnerById({ id: authUser.userId }, { authMode: 'userPool' });
  if (ownerRes.errors?.length) redirect('/error');
  const owner = typeof ownerRes.data === 'string' ? JSON.parse(ownerRes.data) : ownerRes.data;

  const userID: string = owner?.data?.OwnerID ?? owner?.OwnerID ?? owner?.id ?? authUser.userId;
  const franchiseIDFallback: string =
    owner?.data?.FranchiseID ?? owner?.franchiseId ?? owner?.franchiseID ?? userID;

  // Server action that RETURNS state (no server redirect)
  async function saveFranchiseSetup(
    franchiseID: string,
    _prev: ActionState,
    formData: FormData
  ): Promise<ActionState> {
    'use server';

    const client = createServerDataClient(cookies);
    const ownerID = userID;

    const franchiseName = (formData.get('franchiseName') ?? '').toString().trim();
    const street = (formData.get('street') ?? '').toString().trim();
    const city = (formData.get('city') ?? '').toString().trim();
    const state = (formData.get('state') ?? '').toString().trim();
    const postalCode = (formData.get('postalCode') ?? formData.get('zip') ?? '').toString().trim();

    const selected = formData.getAll('regions').map(String);
    const serviceRegions = STATES.filter((s) => selected.includes(s));

    if (!franchiseName || !street || !city || !state || !postalCode) {
      return { ok: false, error: 'Please fill out all required fields.' };
    }

    const faObj = { street, city, state, postalCode };
    const franchiseAddress = JSON.stringify(faObj);
    console.log(franchiseAddress)
    const { errors } = await client.mutations.updateFranchiseInfo(
      { franchiseID, ownerID, franchiseName, franchiseAddress, serviceRegions },
      { authMode: 'userPool' }
    );

    if (errors?.length) {
      return { ok: false, error: errors[0].message ?? 'Failed to update franchise.' };
    }

    // Success — let the client redirect
    return { ok: true, error: null };
  }

  // Bind franchiseID so the action is STABLE and matches useFormState signature
  const boundAction = saveFranchiseSetup.bind(null, franchiseIDFallback) as (
    prevState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-4 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-yellow-900 shadow-sm">
          Please finish setting up your account to use the service.
        </div>

        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
          <div className="border-b px-6 py-5">
            <h1 className="text-2xl font-semibold tracking-tight">Set Up Your Bid2Clean Franchise</h1>
            <p className="mt-1 text-sm text-gray-600">
              Enter your franchise details below. You can change these later in Settings.
            </p>
          </div>

          <SetupForm action={boundAction} states={STATES} />
        </div>
      </div>
    </div>
  );
}

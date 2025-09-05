// app/members/cbo/quotes/available/page.tsx
import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import { createServerDataClient } from '@/utils/data-server';

import CBOAvaQuotesPage from '@/components/pages/CBOAvailableQuotesPage';
import LoginError from '@/components/LoginErrorComponent';
import { getCboByIdServer } from '@/utils/getCboByIdServer';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;
export const dynamic = 'force-dynamic';

export default async function AvaQuotesPage() {
  try {
    const authUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
    });

    if (!authUser) redirect('/members/sign-in');

    // Load the CBO profile for this signed-in user
    const cboData = await getCboByIdServer(authUser.userId);
    if (!cboData) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <LoginError />
        </div>
      );
    }

    // Resolve the identifier used as TargetUser in SellRequest_DB
    const memberID: string =
      (cboData as any)?.CBOID ??
      (cboData as any)?.data?.CBOID ??
      authUser.userId;

    // Call the lambda-backed query: memberGetAvailableQuotes
    const client = createServerDataClient(cookies);
    const { data, errors } = await client.queries.memberGetAvailableQuotes(
      { memberID },
      { authMode: 'userPool' }
    );
    if (errors?.length) {
      console.error('memberGetAvailableQuotes errors:', errors);
      redirect('/error');
    }

    const payload = typeof data === 'string' ? JSON.parse(data) : data;
    const quotes = payload?.quotes ?? [];

    return (
      <div className="flex flex-col w-full items-center justify-center min-h-screen bg-gray-100">
        <CBOAvaQuotesPage cboData={cboData} quotes={quotes} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching available quotes:', error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }
}

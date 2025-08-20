// app/members/owner/available-quotes/page.tsx
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth/server';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/../amplify/data/resource';

import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import OwnerAvaQuotesPage from '@/components/pages/OwnerAvailableQuotesPage';
import LoginError from '@/components/LoginErrorComponent';

export const dynamic = 'force-dynamic';

export default async function AvaQuotesPage() {
  try {
    const { user, ownerData } = await runWithAmplifyServerContext({
      nextServerContext: { cookies }, // pass the cookies fn here
      operation: async (ctx) => {
        const user = await getCurrentUser(ctx).catch(() => null);
        if (!user) return { user: null, ownerData: null };

        // Optional: read claims if you need them
        // const session = await fetchAuthSession(ctx);
        // const claims = (session.tokens?.idToken?.payload ?? {}) as Record<string, any>;

        // Gen2 Data call on the server within the same context
        const client = generateClient<Schema>({ authMode: 'userPool' });
        const result = await client.models.Owner.get({ id: user.userId });
        if (result.errors?.length) {
          throw new Error(result.errors.map((e) => e.message).join('; '));
        }

        return { user, ownerData: result.data ?? null };
      },
    });

    if (!user) {
      redirect('/members/sign-in');
    }

    return (
      <div className="flex w-full flex-col min-h-screen">
        <OwnerAvaQuotesPage ownerData={ownerData} />
      </div>
    );
  } catch (err) {
    console.error(
      'AvaQuotesPage (server) error:',
      err instanceof Error ? err.message : err
    );
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }
}

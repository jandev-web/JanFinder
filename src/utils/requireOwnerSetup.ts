// server-only
import 'server-only';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { createServerDataClient } from '@/utils/data-server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import { unstable_noStore as noStore } from 'next/cache';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;
export const dynamic = 'force-dynamic';

export async function requireOwnerSetup() {
    'use server';
    noStore();
    // 1) Who’s signed in?
    const authUser = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
    });
    if (!authUser) redirect('/business/sign-in');
    // Derive owner id — adjust this to match your Owner_DB PK
    const ownerID = authUser.userId;

    // 2) Query Owner
    const client = createServerDataClient(cookies);
    const { data, errors } = await client.queries.getOwnerById({ id: ownerID }, { authMode: 'userPool' });

    if (errors?.length) {

        redirect('/error');
    }

    // Expecting something like: { firstSignIn: boolean, ... }
    const owner = typeof data === 'string' ? JSON.parse(data) : data;
    const firstSignIn = !!owner?.data?.firstSignIn;
    // 3) Gate
    if (!firstSignIn) {
        // Add a hint param the setup page can read to show a banner/toast
        redirect('/business/franchise/set-up');
    }

    // If we get here, the user is allowed through
    return { owner, ownerID };
}

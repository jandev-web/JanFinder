import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import LoginError from '@/components/LoginErrorComponent';
import { getCboByIdServer } from '@/utils/getCboByIdServer';
import CBOAllQuotesPage from "@/components/pages/CBOAllQuotesPage";

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;

export const dynamic = "force-dynamic";


export default async function AllQuotesPage() {
  try {
    const authUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
    });

    if (!authUser) {
      redirect('/members/sign-in');
    }

    const cboData = await getCboByIdServer(authUser.userId)
    console.log(cboData);
    if (!cboData) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <LoginError />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <CBOAllQuotesPage cboData={cboData} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }
}

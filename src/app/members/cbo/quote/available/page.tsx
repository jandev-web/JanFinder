// app/members/cbo/quotes/available/page.tsx (or your actual route)
import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import { createServerDataClient } from '@/utils/data-server';

import LoginError from '@/components/LoginErrorComponent';
import { getCboByIdServer } from '@/utils/getCboByIdServer';
import getQuotePDF from '@/utils/getQuotePDF';
import CBOAvailableQuoteClient from '@/components/pages/CBOAvailableQuoteClient';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;
export const dynamic = 'force-dynamic';

type SP = { id?: string | string[] };

export default async function AvailableQuotePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  try {
    const authUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
    });

    if (!authUser) redirect('/members/sign-in');

    const sp = await searchParams;
    const raw = sp?.id;
    const id = Array.isArray(raw) ? raw[0] : raw ?? '';
    if (!id) redirect('/error');

     // per your note: pass only the requestID
    const quoteID = id;   // assume id is also the quoteID for display/pdf

    // Get CBO identity (for accept)
    const cboData = await getCboByIdServer(authUser.userId);
    if (!cboData) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <LoginError />
        </div>
      );
    }
    const memberCBOID: string =
      (cboData as any)?.CBOID ??
      (cboData as any)?.data?.CBOID ??
      authUser.userId;

    // Fetch the quote by quoteID
    const client = createServerDataClient(cookies);
    const { data, errors } = await client.queries.getQuote(
      { quoteID },
      { authMode: 'userPool' }
    );
    if (errors?.length) redirect('/error');
    const quotePayload = typeof data === 'string' ? JSON.parse(data) : data;
    const quote = quotePayload?.quote ?? quotePayload ?? null;
    const requestID = quote.latestRequestID;
    // Server action: PDF URL (signed)
    const getQuotePdfAction = async () => {
      'use server';
      return await getQuotePDF(quoteID);
    };

    // Server action: accept the sell request (lambda-backed resolver)
    const acceptQuoteAction = async (form: { requestID: string; memberCBOID: string }) => {
      'use server';
      
      const { requestID, memberCBOID } = form;
      console.log('RequestID from util function', requestID)
      if (!requestID || !memberCBOID) throw new Error('Missing fields');
      const sc = createServerDataClient(cookies);
      const res = await sc.mutations.memberAcceptSellRequest(
        { requestID, memberCBOID },
        { authMode: 'userPool' }
      );
      if (res.errors?.length) throw new Error(res.errors.map(e => e.message).join('; '));
      return typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
    };

    return (
      <div className="flex w-full flex-col min-h-screen">
        <CBOAvailableQuoteClient
          requestID={requestID}
          quote={quote}
          memberCBOID={memberCBOID}
          getQuotePdfAction={getQuotePdfAction}
          acceptQuoteAction={acceptQuoteAction}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading available quote:', error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }
}

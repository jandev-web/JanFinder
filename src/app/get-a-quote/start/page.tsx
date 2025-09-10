// app/get-a-quote/start/page.tsx
import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import { fetchAuthSession } from 'aws-amplify/auth';
import { createServerDataClient } from '@/utils/data-server'

import Footer from '@/components/Footer';
import QuoteWizard from '@/components/quote/QuoteWizard';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;
export const dynamic = 'force-dynamic';

type SP = { qid?: string | string[] };


export default async function CustomerStartQuotePage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const raw = sp?.qid;
  const quoteID = Array.isArray(raw) ? raw[0] : raw ?? '';

  if (!quoteID) {
    // No quote id — bounce to entry page (or show a friendly message)
    redirect('/get-a-quote');
  }
  const s = await fetchAuthSession({ forceRefresh: true });
  const mode = s.tokens ? 'userPool' : 'identityPool';


  const client = createServerDataClient(cookies);
  const quoteRes = await client.queries.getQuote({ quoteID }, { authMode: mode });
  if (quoteRes.errors?.length) {
    //redirect('/error');
    console.log(quoteRes.errors);
  }
  
  const quoteData = typeof quoteRes.data === 'string' ? JSON.parse(quoteRes.data) : quoteRes.data;
  const initialQuote = quoteData?.quote ?? quoteData ?? null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100">
      

      <div className="pb-2 pt-8">
        
        <QuoteWizard initialQuote={initialQuote} />
      </div>

      <Footer />
    </div>
  );
}

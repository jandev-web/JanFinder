import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import { createServerDataClient } from '@/utils/data-server';

import Header from "@/components/Header";
import ConfirmationPage from "@/components/pages/ConfirmationPage";
import Footer from "@/components/Footer";

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;
export const dynamic = 'force-dynamic';

type SP = { qid?: string | string[] };

// small helper to pull name + cost from selected package
function getSelectedInfo(
  options: Array<{ packageType: string; packageName?: string; packageCost?: number }> | undefined,
  choice: string | null | undefined
): { packageName?: string; packageCost?: number } {
  const choiceStr = (choice ?? '').toString().trim();
  if (!options?.length || !choiceStr) return {};
  const hit = options.find(o => o.packageType === choiceStr);
  return {
    packageName:
      hit && typeof hit.packageName === 'string' && hit.packageName.trim()
        ? hit.packageName
        : undefined,
    packageCost:
      hit && typeof hit.packageCost === 'number' && !Number.isNaN(hit.packageCost)
        ? hit.packageCost
        : undefined,
  };
}

export default async function CongratsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const raw = sp?.qid;
  const quoteID = Array.isArray(raw) ? raw[0] : raw ?? '';
  if (!quoteID) redirect('/get-a-quote');

  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
  });

  const client = createServerDataClient(cookies);

  const quoteRes = await client.queries.getQuote(
    { quoteID },
    { authMode: authUser ? 'userPool' : 'identityPool' }
  );

  if (quoteRes?.errors?.length) {
    console.log(quoteRes.errors);
    // you could redirect('/error') here if desired
  }

  const quoteData = typeof quoteRes?.data === 'string' ? JSON.parse(quoteRes.data) : quoteRes?.data;
  const initialQuote = quoteData?.quote ?? quoteData ?? null;

  // --- Build the data object for ConfirmationPage ---
  const qi = initialQuote?.quoteInfo ?? {};
  const meas = initialQuote?.customerMeasurements ?? initialQuote?.ownerMeasurements ?? {};

  const packageChoice = initialQuote?.package?.packageChoice ?? '';
  const packageOptions = initialQuote?.package?.packageOptions ?? [];
  const contact = initialQuote?.customerData
  const { packageName, packageCost } = getSelectedInfo(packageOptions, packageChoice);

  const data = {
    // show the friendly name in the hero sentence
    selectedPackage: packageName ?? packageChoice ?? '',
    // also provide the explicit name for the summary
    contact: contact ?? '',
    selectedName: packageName ?? '',
    facilityType: qi?.facilityType ?? '',
    sqft: Number(meas?.sqft ?? qi?.sqft ?? 0),
    selectedCost: packageCost ?? 0,
    frequency: qi?.frequency ?? '',
    rooms: Array.isArray(qi?.roomTypes) ? qi.roomTypes : [],
  };

  return (
    <div className="bg-gray-100 flex flex-col w-full min-h-screen">
      
        <ConfirmationPage data={data} />
      
    </div>
  );
}

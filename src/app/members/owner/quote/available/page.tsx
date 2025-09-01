// app/members/owner/quote/available/page.tsx
import { redirect } from 'next/navigation';
import { AuthGetCurrentUserServer, cookiesClient } from '@/utils/amplify-utils';
import OwnerSingleAvailableQuote from '@/components/pages/OwnerAvailableQuote';
import OwnerFooter from '@/components/OwnerFooter';
import { acceptQuoteOwnerAction } from '@/utils/OwnerAcceptQuote';

export const dynamic = 'force-dynamic';

type SP = { quoteID?: string | string[] };

export default async function AvailableQuotePage({
  searchParams,
}: {
  searchParams: Promise<SP> ; // ← not a Promise
}) {
  const sp = await searchParams;
  const raw = sp?.quoteID;
  const quoteID = Array.isArray(raw) ? raw[0] : raw ?? '';

  const user = await AuthGetCurrentUserServer();
  if (!user) redirect('/login');
  if (!quoteID) redirect('/error');

  // Server-side owner fetch
  const { data: ownerData, errors: ownerErrors } = await cookiesClient.queries.getOwnerById(
    { id: user.userId },
    { authMode: 'userPool' }
  );
  if (ownerErrors?.length) redirect('/error');

  const owner = typeof ownerData === 'string' ? JSON.parse(ownerData) : ownerData;
  const userID = owner?.data?.OwnerID;
  const franchiseID = owner?.data?.FranchiseID;
  if (!userID || !franchiseID) redirect('/error');

  // Server-side quote fetch
  const { data: quoteData, errors: quoteErrors } = await cookiesClient.queries.getQuote(
    { quoteID },
    { authMode: 'userPool' }
  );
  if (quoteErrors?.length) redirect('/error');
  const quote = typeof quoteData === 'string' ? JSON.parse(quoteData) : quoteData;

  // Zero-arg server action; nothing sensitive crosses the boundary
  const acceptQuote = async () => {
    'use server';
    await acceptQuoteOwnerAction(quoteID, franchiseID, userID);
    redirect('/members/owner/quotes/available');
  };

  return (
    <div className="flex w-full flex-col min-h-screen">
      <OwnerSingleAvailableQuote
        initialQuote={quote?.quote ?? null}
        acceptQuoteAction={acceptQuote} // ← zero-arg server action
      />
      <OwnerFooter />
    </div>
  );
}

import React from 'react';
import '@aws-amplify/ui-react/styles.css'; // Ensure the styles are imported
import { cookiesClient, AuthGetCurrentUserServer } from "@/utils/amplify-utils";
import CBOQuote from '@/components/pages/SingleCBOQuotePage';
import CBOHeader from '@/components/CBOHeader';

export default async function SingleCBOQuotePage({ searchParams }: { searchParams: { quoteID: string; page: string } }) {
  // Fetch user data server-side
  const user = await AuthGetCurrentUserServer();

  // Retrieve search parameters
  const quoteParam = searchParams.quoteID;
  const prevPage = searchParams.page;

  if (!user) {
    return <div>User not authenticated</div>; // Handle unauthenticated state
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Header Section */}
      <div className="pt-10">
        <CBOHeader user={user} />
      </div>

      {/* Quote Section */}
      <div className="flex-1 flex pt-10">
        <CBOQuote user={user} quoteID={quoteParam} prevPage={prevPage} />
      </div>
    </div>
  );
}

import React from "react";
import CBOHeader from "@/components/CBOHeader";
import AllQuotesCBO from "@/components/pages/AllQuotesCBO";
import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";

export default async function AllQuotesPage() {
  // Fetch user data server-side
  const user = await AuthGetCurrentUserServer();

  if (!user) {
    return <div>User not authenticated</div>; // Handle unauthenticated state
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Header Section */}
      <div className="pt-10">
        <CBOHeader user={user} />
      </div>
      {/* All Quotes Section */}
      <div className="flex-1 flex pt-10">
        <AllQuotesCBO user={user} />
      </div>
    </div>
  );
}

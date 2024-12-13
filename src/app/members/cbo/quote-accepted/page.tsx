import React from "react";
import CBOHeader from "@/components/CBOHeader";
import { CBOQuoteAccepted } from "@/components";
import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";

export default async function QuoteAcceptedPage() {
  // Fetch user data server-side
  const user = await AuthGetCurrentUserServer();

  if (!user) {
    return <div>User not authenticated</div>; // Handle unauthenticated state
  }

  return (
    <div>
      {/* Header Section */}
      <CBOHeader user={user} />
      
      {/* Quote Accepted Section */}
      <CBOQuoteAccepted />
    </div>
  );
}

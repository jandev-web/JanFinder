import React from "react";
import "@aws-amplify/ui-react/styles.css"; // Ensure the styles are imported
import CBOHeader from "@/components/CBOHeader";
import { AcceptedQuotes } from "@/components";
import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";

export const dynamic = "force-dynamic";


export default async function AcceptedQuotesPage() {
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
      {/* Accepted Quotes Section */}
      <div className="flex-1 flex pt-10">
        <AcceptedQuotes user={user} />
      </div>
    </div>
  );
}

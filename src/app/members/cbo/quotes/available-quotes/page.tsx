import React from "react";
import "@aws-amplify/ui-react/styles.css";
import CBOHeader from "@/components/CBOHeader";
import AvailableQuotes from "@/components/pages/AvailableQuotes";
import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";


export default async function AvailableQuotesPage() {
  // Fetch user data server-side
  const user = await AuthGetCurrentUserServer();

  if (!user) {
    // Redirect to login if unauthenticated
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Header Section */}
      <div className="pt-10">
        <CBOHeader user={user} />
      </div>
      {/* Available Quotes Section */}
      <div className="flex-1 flex pt-10">
        <AvailableQuotes user={user} />
      </div>
    </div>
  );
}

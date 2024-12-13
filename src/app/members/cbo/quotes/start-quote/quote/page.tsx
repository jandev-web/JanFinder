import React from "react";
import OwnerHeader from "@/components/OwnerHeader";
import CBOBuildingData from "@/components/pages/CBOBuildingData";
import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";

export default async function AllQuotesPage() {
  // Fetch user data server-side
  const user = await AuthGetCurrentUserServer();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>User not authenticated</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Header Section */}
      <div className="pt-10">
        <OwnerHeader user={user} />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex pt-10">
        <CBOBuildingData user={user} />
      </div>
    </div>
  );
}

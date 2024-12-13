import React from "react";
import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";
import CBOHeader from "@/components/CBOHeader";
import CBOSubPage from "@/components/pages/CBOSubscribe";
import { redirect } from "next/navigation";

export default async function PaymentPage() {
  try {
    // Fetch authenticated user server-side
    const user = await AuthGetCurrentUserServer();

    // Redirect to login if the user is not authenticated
    if (!user) {
      redirect("/login");
    }

    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
        {/* Header Section */}
        <div className="w-full pb-12">
          <CBOHeader user={user} />
        </div>

        {/* Main Content */}
        <div className="w-full flex flex-col items-center mt-10">
          <CBOSubPage user={user} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    redirect("/login");
  }
}

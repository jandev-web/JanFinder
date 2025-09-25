import React from "react";
import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import CBOHeader from "@/components/CBOHeader";
import PaymentForm from "@/components/pages/paymentPage";

export default async function PaymentPage() {
  try {
    // Fetch the authenticated user on the server
    const user = await AuthGetCurrentUserServer();

    // Redirect to login if no user is found
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
          <PaymentForm user={user} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user:", error);

    // Redirect to login on error
    redirect("/login");
  }
}

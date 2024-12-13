import React from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";
import CBOHeader from "@/components/CBOHeader";
import PaymentForm from "@/components/pages/paymentPage";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default async function PaymentPage() {
  // Fetch user server-side
  const user = await AuthGetCurrentUserServer();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>User not authenticated</p>
      </div>
    );
  }

  // Access search parameters
  const searchParams = new URLSearchParams(window.location.search);
  const quoteID = searchParams.get("quoteId");

  if (!quoteID) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Quote ID is missing. Please provide a valid quote ID.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="w-full pb-12">
        <CBOHeader user={user} />
      </div>

      {/* Main Content */}
      <div className="w-full flex flex-col items-center mt-10">
        <Elements stripe={stripePromise}>
          <PaymentForm user={user} quoteID={quoteID} />
        </Elements>
      </div>
    </div>
  );
}

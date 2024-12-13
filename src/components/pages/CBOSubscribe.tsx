'use client';

import React from "react";
import { useSearchParams } from "next/navigation";
import PaymentForm from "@/components/pages/paymentPage";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CBOSubPageProps {
  user: any;
}

const CBOSubPage: React.FC<CBOSubPageProps> = ({ user }) => {
  const searchParams = useSearchParams();
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
      <div className="w-full flex flex-col items-center mt-10">
        <Elements stripe={stripePromise}>
          <PaymentForm user={user} />
        </Elements>
      </div>
    </div>
  );
};

export default CBOSubPage;

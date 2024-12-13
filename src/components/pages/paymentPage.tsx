"use client";

import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import makePayment from "@/utils/makePayment";
import fetchCBOById from "@/utils/getCBOByID";
import getQuoteDetails from "@/utils/getQuoteDetails";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  user: any;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();

  const quoteID = searchParams.get("quoteId");
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [cbo, setCBO] = useState(null);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.sub) {
          const cboData = await fetchCBOById(user.sub);
          setCBO(cboData);
        }

        if (quoteID) {
          const quoteData = await getQuoteDetails(quoteID);
          setQuote(quoteData);
          setAmount(quoteData?.Package?.cost || 0);
        } else {
          setMessage("Quote ID is missing.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Error fetching required data. Please try again later.");
      }
    };

    fetchData();
  }, [quoteID, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const card = elements?.getElement(CardElement);
    if (!stripe || !elements || !card) {
      setMessage("Stripe is not properly initialized.");
      setLoading(false);
      return;
    }

    try {
      const result = await makePayment({ amount, quoteID, userID: user.sub });

      if (result?.clientSecret) {
        const { error, paymentIntent } = await stripe.confirmCardPayment(result.clientSecret, {
          payment_method: { card },
        });

        if (error) {
          setMessage(`Payment failed: ${error.message}`);
        } else if (paymentIntent?.status === "succeeded") {
          setMessage("Payment successful!");
        } else {
          setMessage("Unexpected payment status. Please contact support.");
        }
      } else {
        setMessage("Payment initiation failed.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setMessage("An error occurred during payment processing.");
    } finally {
      setLoading(false);
    }
  };

  if (!quoteID) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Quote ID is missing. Please provide a valid quote ID.</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <form onSubmit={handleSubmit} className="p-8 space-y-4">
        <h1 className="text-2xl font-bold">Make a Payment</h1>
        <p>Amount: ${amount.toFixed(2)}</p>
        <CardElement className="p-2 border rounded w-full" />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="bg-green-500 text-white p-2 rounded w-full"
        >
          {loading ? "Processing..." : "Pay"}
        </button>
        {message && <p className="text-red-500">{message}</p>}
      </form>
    </Elements>
  );
};

export default PaymentForm;

'use client';

import React from 'react';
import { useUser } from '@/components/UserContext';
import { useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import CBOHeader from '@/components/CBOHeader';
import PaymentForm from '@/components/pages/paymentPage';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentPage: React.FC = () => {
  const { attributes } = useUser();
  const currentUser = attributes
  const searchParams = useSearchParams();
  const quoteID = searchParams.get('quoteId');
  console.log(quoteID)

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="w-full pb-12">
        <CBOHeader user={currentUser} />
      </div>

      {/* Main Content */}
      <div className="w-full flex flex-col items-center mt-10">
        <Elements stripe={stripePromise}>
          <PaymentForm user={currentUser} quoteID={quoteID} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage;

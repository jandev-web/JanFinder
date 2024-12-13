import React from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CBOHeader from '@/components/CBOHeader';
import PaymentForm from '@/components/pages/paymentPage';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default async function PaymentPage({ searchParams }: { searchParams: { quoteId: string } }) {
  try {
    const user = await AuthGetCurrentUserServer();

    if (!user) {
      redirect('/login');
    }

    const quoteID = searchParams.quoteId;

    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
        <div className="w-full pb-12">
          <CBOHeader user={user} />
        </div>
        <div className="w-full flex flex-col items-center mt-10">
          <Elements stripe={stripePromise}>
            <PaymentForm user={user} quoteID={quoteID} />
          </Elements>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    redirect('/login');
  }
}

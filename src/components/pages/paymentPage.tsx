'use client';

import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import makePayment from '@/utils/makePayment';
import fetchCBOById from '@/utils/getCBOByID';
import getQuoteDetails from '@/utils/getQuoteDetails';

interface PaymentFormProps {
    quoteID: any;
    user: any;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ user, quoteID }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [cbo, setCBO] = useState(null);
    const [quote, setQuote] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.sub) {
                    console.log(`Fetching CBO data for user ID: ${user.sub}`);
                    const cboData = await fetchCBOById(user.sub);
                    setCBO(cboData);
                    console.log('CBO Data:', cboData);
                } else {
                    console.warn('User ID not available.');
                }

                if (quoteID) {
                    console.log(`Fetching quote details for quote ID: ${quoteID}`);
                    const quoteData = await getQuoteDetails(quoteID);
                    setQuote(quoteData);
                    setAmount(quoteData?.Package?.cost);
                    console.log('Quote Data:', quoteData);
                } else {
                    console.error('Quote ID not provided.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setMessage('Error fetching required data. Please try again later.');
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
            console.error('Stripe or card element not initialized.');
            setMessage('Unable to process payment. Please try again later.');
            setLoading(false);
            return;
        }

        try {
            console.log('Initiating payment...');
            const result = await makePayment({ amount, quoteID, userID: user.sub });
            console.log('Payment initiation result:', result);

            if (result?.clientSecret) {
                const { error, paymentIntent } = await stripe.confirmCardPayment(result.clientSecret, {
                    payment_method: { card },
                });

                if (error) {
                    console.error('Payment confirmation error:', error);
                    setMessage(`Payment failed: ${error.message}`);
                } else if (paymentIntent?.status === 'succeeded') {
                    console.log('Payment succeeded:', paymentIntent);
                    setMessage('Payment successful!');
                } else {
                    console.warn('Unexpected payment intent status:', paymentIntent?.status);
                    setMessage('Unexpected payment status. Please contact support.');
                }
            } else {
                console.error('Payment initiation failed: No client secret received.');
                setMessage('Payment could not be initiated. Please try again.');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            setMessage('An error occurred during payment processing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">Make a Payment</h1>
            <p>Amount: ${amount.toFixed(2)}</p>
            <CardElement className="p-2 border rounded w-full" />
            <button
                type="submit"
                disabled={!stripe || loading}
                className="bg-green-500 text-white p-2 rounded w-full"
            >
                {loading ? 'Processing...' : 'Pay'}
            </button>
            {message && <p className="text-red-500">{message}</p>}
        </form>
    );
};

export default PaymentForm;

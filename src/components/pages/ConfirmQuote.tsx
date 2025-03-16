'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/loadingScreen';
import getQuoteDetails from '@/utils/getQuoteDetails';
import confirmQuote from '@/utils/confirmQuote'

interface Task {
    taskName: string;
    taskFrequency: string;
}

interface Room {
    roomName: string;
    tasks: Task[];
}

interface Address {
    city: string;
    country: string;
    postalCode: string;
    state: string;
    street: string;
}

interface Package {
    id: string;
    name: string;
    cost: number;
    description: string;
    tasks: Room[];
    blurb: string;
}

interface CustomerInfo {
    firstName: string;
    lastName: string;
    company: string;
    address: Address;
    email: string;
    phone: string;
}

interface QuoteInfo {
    facilityType: string;
    sqft: string;
}

const ConfirmationPage: React.FC = () => {
    const router = useRouter();
    const [quoteID, setQuoteID] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState<any>('None');

    const [quoteInfo, setQuoteInfo] = useState<any>(null);
    useEffect(() => {
        const fetchCustomerData = async () => {

            setLoading(true);

            try {
                if (typeof window !== "undefined") {
                    const storedQuoteID = sessionStorage.getItem('customerData');

                    if (!storedQuoteID) {
                        console.warn('No quoteID found in sessionStorage.');
                        router.push('/quote');
                        return;
                    }

                    setQuoteID(storedQuoteID);


                    const quoteDetails = await getQuoteDetails(storedQuoteID);
                    const addressInfo = quoteDetails.customerData.address
                    if (!addressInfo.city || !addressInfo.country || !addressInfo.postalCode || !addressInfo.state || !addressInfo.street) {
                        setAddress('None')
                    }
                    else {
                        const addressString = `${addressInfo.street}, ${addressInfo.city} ${addressInfo.state}, ${addressInfo.postalCode}, ${addressInfo.country}`
                        setAddress(addressString)
                    }
                    setQuoteInfo(quoteDetails);
                    setLoading(false)



                    
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                //router.push('/');
            }
        };

        fetchCustomerData();
    }, [quoteID, router]);

    const handleConfirm = async () => {
        if (!quoteID || !quoteInfo) return;
        try {
            const confirmedQuote = await confirmQuote(quoteID);
            
            router.push(`/get-a-quote/confirmation`);
        } catch (error) {
            console.error("Confirmation failed:", error);
            alert("Failed to confirm. Please try again.");
        }

    };

    if (loading) {
        return <LoadingSpinner />;
    }
    console.log(quoteInfo)

    const { customerData, quoteInfo: quoteDetails, costInfo, Package } = quoteInfo;
    console.log(costInfo.finalCost)


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full border border-gray-300">
                <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">Confirm Quote</h1>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-green-700">Customer Information</h2>
                    <p><strong>Company:</strong> {customerData?.company || 'None'}</p>
                    <p><strong>Email:</strong> {customerData?.email || 'None'}</p>
                    <p><strong>Phone:</strong> {customerData?.phone || 'None'}</p>
                    <p><strong>Address:</strong> {address || 'None'}</p>
                </div>

                <div className="space-y-6 mt-6">
                    <h2 className="text-xl font-semibold text-green-700">Quote Information</h2>
                    <p><strong>Facility Type:</strong> {quoteDetails?.facilityType || 'None'}</p>
                    <p><strong>Frequency:</strong> {quoteDetails?.frequency || 'None'}</p>
                    <p><strong>Cost:</strong> {costInfo?.finalCost}</p>
                    <p><strong>Square Footage:</strong> {quoteDetails?.sqft || 'None'}</p>
                </div>

                <div className="flex justify-between mt-8">
                    <button
                        onClick={handleConfirm}
                        className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                    >
                        Confirm
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ConfirmationPage;

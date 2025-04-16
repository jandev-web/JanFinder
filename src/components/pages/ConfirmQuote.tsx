'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/loadingScreen';
import getQuoteDetails from '@/utils/getQuoteDetails';
import confirmQuote from '@/utils/confirmQuote'
import QuoteProgressBar from '@/components/QuoteProgressBar';

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
    const [roomInfo, setRoomInfo] = useState<any>(null);

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
                    setRoomInfo(quoteDetails.quoteInfo.roomTypes);
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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
            <QuoteProgressBar stepNumber={7} />
            <h2 className="text-3xl text-yellow-500 font-bold mb-6">Final Step!</h2>
            {/* Step Message Section */}
            <div className="bg-[#001F54] text-white p-8 rounded-md shadow-lg max-w-2xl text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">
                    Step <span className="text-yellow-500">7</span>: Confirm Your Information
                </h1>
                <p className="text-xl">
                    Please confirm that all of the following information is correct.
                </p>
            </div>

            {/* Confirmation Section */}
            <div className="bg-gradient-to-br from-white to-gray-200 p-10 rounded-xl shadow-2xl max-w-2xl w-full border border-yellow-500">
                <h2 className="text-3xl font-bold text-[#001F54] mb-6 text-center">
                    Confirm Information
                </h2>

                {/* Customer Information */}
                <div className="space-y-6 border-b border-gray-300">
                    <h2 className="text-xl font-semibold text-yellow-500">Customer Information</h2>
                    <p className='text-gray-600'>
                        <strong className='text-[#001F54]'>Customer Name:</strong> {customerData?.firstName || 'None'} {customerData?.lastName || ''}
                    </p>
                    <p className='text-gray-600'>
                        <strong className='text-[#001F54]'>Company:</strong> {customerData?.company || 'None'}
                    </p>
                    <p className='text-gray-600'>
                        <strong className='text-[#001F54]'>Email:</strong> {customerData?.email || 'None'}
                    </p>
                    <p className='text-gray-600'>
                        <strong className='text-[#001F54]'>Phone:</strong> {customerData?.phone || 'None'}
                    </p>
                    <p className='text-gray-600 pb-4'>
                        <strong className='text-[#001F54]'>Facility Address:</strong> {address || 'None'}
                    </p>
                </div>

                {/* Quote Information */}
                <div className="space-y-6 mt-6 border-b border-gray-300">
                    <h2 className="text-2xl font-semibold text-yellow-500">Quote Information</h2>
                    <p className='text-gray-600'>
                        <strong className='text-[#001F54]'>Facility Type:</strong> {quoteDetails?.facilityType || 'None'}
                    </p>
                    <p className='text-gray-600'>
                        <strong className='text-[#001F54]'>Square Footage:</strong> {quoteDetails?.sqft || 'None'}
                    </p>
                    <p className='text-gray-600'>
                        <strong className='text-[#001F54]'>Frequency:</strong> {quoteDetails?.frequency || 'None'}
                    </p>
                    <p className='text-gray-600'>
                        <strong className='text-[#001F54]'>Cost:</strong> ${costInfo?.finalCost}
                    </p>
                    <p className='text-gray-600 pb-4'>
                        <strong className='text-[#001F54]'>Package:</strong> {Package?.name || 'None'}
                    </p>
                </div>

                {/* Room Information */}
                <div className="space-y-6 mt-6 border-b border-gray-300">
                    <h2 className="text-2xl font-semibold text-yellow-500 mb-6">Room Information</h2>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-96 overflow-y-auto">
                        <div className="space-y-4">
                            {Package.rooms.map((room: any, index: number) => (
                                <div key={index} className="border-b border-gray-300 pb-4">
                                    <h4 className="text-xl font-semibold text-[#001F54] mb-2">
                                        {room.roomName}: {roomInfo[room.roomName]} sqft
                                    </h4>
                                    <ul className="pl-4 space-y-2">
                                        {room.tasks.map((task: any, idx: number) => (
                                            <li key={idx} className="flex justify-between items-center text-sm">
                                                <span className="font-medium">{task.taskName}</span>
                                                <span className="italic text-gray-500">{task.taskFrequency}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Confirm Button */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleConfirm}
                        className="px-6 py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-300"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>

    );
};

export default ConfirmationPage;

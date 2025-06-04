'use client';

import React, { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/loadingScreen';
import confirmQuote from '@/utils/confirmQuote'
import { useRouter } from 'next/navigation';

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
    quoteID: any;
    quotePackage: any;
    facilityType: string;
    sqft: string;
    cost: any;
    customerDetails: any;
    roomTypes: any;
    quoteBudget: any;
    quoteFrequency: any;
    onNextStep: (stepNumber: number) => void;
    onMoveOn: (moveOn: boolean) => void;
    onMoveBack: (moveBack: boolean) => void;
}

const ConfirmationPage: React.FC<QuoteInfo> = ({ quoteID, roomTypes, quotePackage, facilityType, sqft, cost, customerDetails, quoteBudget, quoteFrequency, onMoveBack, onMoveOn, onNextStep }) => {
    

    const [loading, setLoading] = useState(false);

    const addressInfo = customerDetails.address
    const address = `${addressInfo.street}, ${addressInfo.city} ${addressInfo.state}, ${addressInfo.postalCode}, ${addressInfo.country}`

    const router = useRouter();



    console.log(quotePackage)






    const handleConfirm = async () => {
        if (!quoteID) return;
        try {
            setLoading(true);
            const confirmedQuote = await confirmQuote(quoteID);
            
            router.push('/get-a-quote/confirmed')
            
            
        } catch (error) {
            console.error("Confirmation failed:", error);
            alert("Failed to confirm. Please try again.");
        }

    };

    if (loading) {
        return <LoadingSpinner />;
    }
    


    return (
        <div className="flex flex-col items-center">
            
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
                        <strong className='text-[#001F54]'>Customer Name:</strong> {customerDetails?.firstName || 'None'} {customerDetails?.lastName || ''}
                    </p>
                    <p className='text-gray-600'>
                        <strong className='text-[#001F54]'>Company:</strong> {customerDetails?.company || 'None'}
                    </p>
                    <p className='text-gray-600'>
                        <strong className='text-[#001F54]'>Email:</strong> {customerDetails?.email || 'None'}
                    </p>
                    <p className='text-gray-600'>
                        <strong className='text-[#001F54]'>Phone:</strong> {customerDetails?.phone || 'None'}
                    </p>
                    <p className='text-gray-600 pb-4'>
                        <strong className='text-[#001F54]'>Facility Address:</strong> {address || 'None'}
                    </p>
                </div>

                {/* Quote Information */}
                <div className="space-y-6 mt-6 border-b border-gray-300">
                    <h2 className="text-2xl font-semibold text-yellow-500">Quote Information</h2>
                    <p className='text-gray-600'>
                        <strong className='text-[#001F54]'>Facility Type:</strong> {facilityType || 'None'}
                    </p>
                    <p className='text-gray-600'>
                        <strong className='text-[#001F54]'>Square Footage:</strong> {sqft || 'None'}
                    </p>
                    <p className='text-gray-600'>
                        <strong className='text-[#001F54]'>Frequency:</strong> {quoteFrequency || 'None'}
                    </p>
                    <p className='text-gray-600'>
                        <strong className='text-[#001F54]'>Cost:</strong> ${cost}
                    </p>
                    <p className='text-gray-600 pb-4'>
                        <strong className='text-[#001F54]'>Package:</strong> {quotePackage?.name || 'None'}
                    </p>
                </div>

                {/* Room Information */}
                <div className="space-y-6 mt-6 border-b border-gray-300">
                    <h2 className="text-2xl font-semibold text-yellow-500 mb-6">Room Information</h2>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-96 overflow-y-auto">
                        <div className="space-y-4">
                            {quotePackage.rooms.map((room: any, index: number) => (
                                <div key={index} className="border-b border-gray-300 pb-4">
                                    <h4 className="text-xl font-semibold text-[#001F54] mb-2">
                                        {room.roomName}: {roomTypes[room.roomName]} sqft
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

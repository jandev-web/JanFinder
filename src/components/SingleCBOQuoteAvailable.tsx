'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkIsOwner } from '@/utils/checkIsOwner';
import makeQuotePDF from '@/utils/generateQuoteDoc'
import fetchSellRequestByID from '@/utils/getSellRequestByID'
import fetchOwnerById from '@/utils/getOwnerById';
import getFranchiseInfo from '@/utils/getFranchiseInfo';
import LoadingSpinner from '@/components/loadingScreen'
import answerSellRequest from '@/utils/answerSellRequest'
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
    Timestamp: string;
}

interface CBOQuoteProps {
    user: any;
    requestID: any;
}

const CBOQuote: React.FC<CBOQuoteProps> = ({ user, requestID }) => {
    const router = useRouter();
    const [quoteInfo, setQuoteInfo] = useState<any>(null);
    const [costInfo, setCostInfo] = useState<any>(null);
    const [roomInfo, setRoomInfo] = useState<any>(null);
    const [customerData, setCustomerData] = useState<any>(null);
    const [quotePackage, setQuotePackage] = useState<any>(null);
    const [timestamp, setTimestamp] = useState<any>(null);
    const [address, setAddress] = useState<any>(null);
    const [showAcceptConfirmation, setShowAcceptConfirmation] = useState<boolean>(false);
    const [showRejectConfirmation, setShowRejectConfirmation] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [quoteID, setQuoteID] = useState<any>(null)
    const [ownerInfo, setOwnerInfo] = useState<any>(null)
    const [franchiseInfo, setFranchiseInfo] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true);
    const [offerTime, setOfferTime] = useState<any>(null)

    console.log(user)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const roleStatus = await checkIsOwner(user);
                setIsOwner(roleStatus ?? false);
                if (requestID) {
                    const data = await fetchSellRequestByID(requestID)
                    console.log(data)
                    const sellRequest = data.sellRequest
                    if (sellRequest) {
                        const toID = sellRequest.ToID
                        if (toID) {
                            if (toID != user.CBOID) {
                                return <p>Prohibited</p>
                            }
                        } else {
                            console.error('ToID not provided')
                        }
                        const sellQuoteID = sellRequest.QuoteID
                        setQuoteID(sellQuoteID)
                        if (sellQuoteID) {
                            await fetchQuoteDetails(sellQuoteID);
                        } else {
                            console.error('Quote ID not provided');
                        }
                        const offeredAt = sellRequest.Timestamp
                        setOfferTime(offeredAt)
                        const ownerID = sellRequest.FromID
                        if (ownerID) {
                            const ownerData = await fetchOwnerById(ownerID)
                            setOwnerInfo(ownerData)
                            if (ownerData) {
                                const franchiseID = ownerData.franchiseID
                                const franchiseData = await getFranchiseInfo(franchiseID)
                                if (franchiseData) {
                                    const franchiseName = franchiseData.franchiseName

                                    setFranchiseInfo(franchiseName)
                                    setIsLoading(false)
                                } else {
                                    console.error('Franchise data not provided');
                                }
                            }
                        } else {
                            console.error('Owner ID not provided');
                        }
                    }
                    else {
                        console.error('Request not returned by api');
                    }
                }

                else {
                    console.error('Request ID not provided');
                }

            } catch (error) {
                console.error('Error fetching user role or quote details:', error);
            }
        };

        fetchData();
    }, [requestID, user]);

    const fetchQuoteDetails = async (quoteID: string) => {
        try {
            const quoteData = {
          "quoteInfo": {
            "roomTypes": [
              {
                "roomType": "string",
                "roomCount": 0,
                "roomPrice": 0
              }
            ],
            "quoteID": "string",
            "quoteName": "string",
            "quoteStatus": "string",
            "quotePrice": 0,
            "quoteDescription": "string",
            "quoteNotes": "string",
            "quoteDate": "string",
            "quoteExpiry": "string"
          },
          "costInfo": {
            "totalCost": 0,
            "totalCostWithTax": 0,
            "taxRate": 0,
            "deposit": 0,
            "depositDueDate": "string",
            "balanceDue": 0,
            "balanceDueDate": "string"
          },
          "Package": {
            "packageID": "string",
            "packageName": "string",
            "packageDescription": "string",
            "packagePrice": 0,
            "packageItems": [
              "string"
            ]
          },
          "customerData": {
            "customerID": "string",
            "firstName": "string",
            "lastName": "string",
            "email": "string",
            "phone": "string",
            "address": {
              "street": "string",
              "city": "string",
              "state": "string",
              "zip": "string"
            }
          },
          "Timestamp": "2024-03-27T00:00:00.000Z",
          "OwnerID": "string",
          "QuoteID": "string"
       }
            console.log(quoteData);
            setQuoteInfo(quoteData.quoteInfo);
            setCostInfo(quoteData.costInfo);
            setQuotePackage(quoteData.Package);
            setCustomerData(quoteData.customerData);
            setTimestamp(quoteData.Timestamp);
            setRoomInfo(quoteData.quoteInfo.roomTypes);
            setAddress(quoteData.customerData.address);

        } catch (error) {
            console.error('Error fetching quote details:', error);
        }
    };

    const acceptAvailableQuote = async () => {
        try {
            const inFranchise = true
            const decision = 'accept'
            console.log('Accepting quote')
            await answerSellRequest(user.CBOID, requestID, inFranchise, decision);
            //router.push('/members/cbo/quotes/available')

        } catch (error) {
            console.error('Error accepting quote:', error);
        }
    };

    const declineAvailableQuote = async () => {
        try {
            const inFranchise = true
            const decision = 'reject'
            console.log('Rejecting quote')
            await answerSellRequest(user.CBOID, requestID, inFranchise, decision);
            //router.push('/members/cbo/quotes/available')

        } catch (error) {
            console.error('Error rejecting quote:', error);
        }
    };



    const goBack = async () => {

        router.push('/members/cbo/quotes/available');

    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
    };

    console.log(quoteInfo);
    // Destructure properties only if quoteInfo exists.

    if (isLoading) {
        return <LoadingSpinner />;
    }


    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => goBack()}
                        className="inline-flex items-center text-[#001F54] hover:text-yellow-500 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="ml-2 font-semibold text-lg">Back</span>
                    </button>
                    <h1 className="flex-grow text-center text-3xl font-bold text-[#001F54]">
                        Contract Offer Details
                    </h1>
                </div>

                {/* Main Card */}
                <div className="bg-white shadow-lg rounded-lg p-8 md:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: All info except Tasks */}
                        <div className="space-y-6">
                            {/* Price */}
                            <div>
                                <h2 className="text-2xl font-bold text-[#001F54]">Price</h2>
                                <p className="mt-2 text-lg text-gray-800">${quotePackage?.packageChoice?.packageCost}</p>
                            </div>

                            {address && (
                                <div>
                                    <h3 className="text-xl font-semibold text-[#001F54]">Facility Address</h3>
                                    <p>{address.street}, {address.city}, {address.state} {address.postalCode}, {address.country}</p>
                                </div>
                            )}
                            {customerData && (
                                <div>
                                    <h3 className="text-xl font-semibold text-[#001F54]">Customer Information</h3>
                                    <ul className="mt-2 space-y-1 text-gray-700">
                                        <li>
                                            <strong>Company:</strong> {customerData.company}
                                        </li>
                                        <li>
                                            <strong>Customer:</strong> {customerData.firstName} {customerData.lastName}
                                        </li>
                                        <li>
                                            <strong>Email:</strong> {customerData.email}
                                        </li>
                                        <li>
                                            <strong>Phone:</strong> {customerData.phone}
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {/* Created Timestamp */}
                            <div>
                                <h3 className="text-xl font-semibold text-[#001F54]">Created On</h3>
                                <p className="mt-2 text-gray-600">{timestamp ? formatDate(timestamp) : 'N/A'}</p>
                            </div>

                            {/* Quote Information */}
                            {quoteInfo && (
                                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                    <h3 className="text-xl font-semibold text-[#001F54] mb-2">
                                        Quote Information
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700">
                                        <li>
                                            <strong>Facility Type:</strong> {quoteInfo.facilityType}
                                        </li>
                                        <li>
                                            <strong>Square Feet:</strong> {quoteInfo.sqft}
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {/* Package Details */}
                            {quotePackage && (
                                <div>
                                    <h3 className="text-xl font-semibold text-[#001F54]">Package Details</h3>
                                    <p className="mt-2 text-gray-800">
                                        <strong>Package:</strong> {quotePackage?.packageChoice?.packageName}
                                    </p>
                                    <p className="mt-1 text-gray-800">
                                        <strong>Cost:</strong> ${quotePackage?.packageChoice?.packageCost}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Tasks in a Scrollable Box */}
                        {quotePackage && (
                            <div>
                                <h4 className="text-lg font-semibold text-[#001F54] mb-4">
                                    Total Day Time: {quotePackage?.packageChoice?.totalDayTimeFromMonth?.toFixed(2)} min/day
                                </h4>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-[36rem] overflow-y-auto space-y-6">

                                    {/* Rooms */}
                                    <div>
                                        <h3 className="text-xl font-bold text-[#001F54] mb-4">Rooms</h3>
                                        {quotePackage?.packageChoice?.rooms?.map((room: any, index: number) => (
                                            <div key={index} className="border-b border-gray-300 pb-4">
                                                <h4 className="text-lg font-semibold text-[#001F54]">
                                                    {room.roomName} – <span className="text-gray-600">{room.totalDayTimeFromMonth?.toFixed(2)} min/day</span>
                                                </h4>
                                                <ul className="pl-4 mt-2 space-y-2">
                                                    {room.roomTasks?.map((task: any, idx: number) => (
                                                        <li key={idx} className="flex justify-between text-sm">
                                                            <div className="font-medium">{task.taskName}</div>
                                                            <div className="italic text-gray-500">
                                                                {task.frequency} – {task.timePerDayFromMonthly?.toFixed(2)} min/day
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Carpet Tasks */}
                                    {quotePackage?.packageChoice?.carpet?.tasks?.length > 0 && (
                                        <div className="border-t border-gray-300 pt-4">
                                            <h3 className="text-xl font-bold text-[#001F54] mb-2">Carpet</h3>
                                            <p className="text-gray-600 mb-2">Total: {quotePackage.packageChoice.carpet.totalDayTimeFromMonth?.toFixed(2)} min/day</p>
                                            <ul className="pl-4 space-y-2">
                                                {quotePackage.packageChoice.carpet.tasks.map((task: any, idx: number) => (
                                                    <li key={idx} className="flex justify-between text-sm">
                                                        <div className="font-medium">{task.taskName}</div>
                                                        <div className="italic text-gray-500">
                                                            {task.frequency} – {task.timePerDayFromMonthly?.toFixed(2)} min/day
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Hardfloor Tasks */}
                                    {quotePackage?.packageChoice?.hardfloor?.tasks?.length > 0 && (
                                        <div className="border-t border-gray-300 pt-4">
                                            <h3 className="text-xl font-bold text-[#001F54] mb-2">Hardfloor</h3>
                                            <p className="text-gray-600 mb-2">Total: {quotePackage.packageChoice.hardfloor.totalDayTimeFromMonth?.toFixed(2)} min/day</p>
                                            <ul className="pl-4 space-y-2">
                                                {quotePackage.packageChoice.hardfloor.tasks.map((task: any, idx: number) => (
                                                    <li key={idx} className="flex justify-between text-sm">
                                                        <div className="font-medium">{task.taskName}</div>
                                                        <div className="italic text-gray-500">
                                                            {task.frequency} – {task.timePerDayFromMonthly?.toFixed(2)} min/day
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Other Time */}
                                    {quotePackage?.packageChoice?.otherDayTimeFromMonth && (
                                        <div className="border-t border-gray-300 pt-4">
                                            <h3 className="text-xl font-bold text-[#001F54] mb-2">Other Tasks</h3>
                                            <p className="text-gray-600">Total: {quotePackage.packageChoice.otherDayTimeFromMonth?.toFixed(2)} min/day</p>
                                        </div>
                                    )}

                                </div>


                            </div>

                        )}
                    </div>

                    {/* Accept Quote Actions */}
                    <div className="mt-10 text-center">
                        {(!showAcceptConfirmation && !showRejectConfirmation) ? (
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setShowAcceptConfirmation(true)}
                                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition"
                                >
                                    Accept Offer
                                </button>
                                <button
                                    onClick={() => setShowRejectConfirmation(true)}
                                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition"
                                >
                                    Decline Offer
                                </button>
                            </div>
                        ) : showAcceptConfirmation ? (
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => acceptAvailableQuote()}
                                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
                                >
                                    Confirm Acceptance
                                </button>
                                <button
                                    onClick={() => setShowAcceptConfirmation(false)}
                                    className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() =>
                                        declineAvailableQuote()
                                    }
                                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition"
                                >
                                    Confirm Rejection
                                </button>
                                <button
                                    onClick={() => setShowRejectConfirmation(false)}
                                    className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>


    );
};

export default CBOQuote;

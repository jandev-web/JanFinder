'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getQuotePDF from '@/utils/getQuotePDF';
import { checkIsOwner } from '@/utils/checkIsOwner';
import makeQuotePDF from '@/utils/generateQuoteDoc'
import fetchOwnerById from '@/utils/getOwnerById';
import getFranchiseInfo from '@/utils/getFranchiseInfo';
import LoadingSpinner from '@/components/loadingScreen'
import fetchSellRequestByID from '@/utils/getSellRequestByID';
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
    quoteID: any;
}

const CBOQuote: React.FC<CBOQuoteProps> = ({ user, quoteID }) => {
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
    const [numOfRooms, setNumOfRooms] = useState<any>(0)
    const [ownerInfo, setOwnerInfo] = useState<any>(null)
    const [franchiseInfo, setFranchiseInfo] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true);
    const [offerTime, setOfferTime] = useState<any>(null)

    console.log(quoteID)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const roleStatus = await checkIsOwner(user);
                setIsOwner(roleStatus ?? false);
                if (quoteID) {
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
                    console.log(quoteData.quoteInfo.roomTypes)

                    let totalRooms = 0;
                    for (let i = 0; i < quoteData.quoteInfo.roomTypes.length; i++) {
                        const room = quoteData.quoteInfo.roomTypes[i];
                        totalRooms += Number(1); // Ensure roomNumber is treated as a number
                    }
                    setNumOfRooms(totalRooms);

                    setAddress(quoteData.customerData.address);
                    const sellRequestID = ''
                    if (sellRequestID) {
                        const sellRequestData = await fetchSellRequestByID(sellRequestID);
                        const sellRequest = sellRequestData.sellRequest
                        console.log(sellRequest)
                        const toID = sellRequest.ToID
                        if (toID) {
                            if (toID != user.CBOID) {
                                return <p>Prohibited</p>
                            }
                        } else {
                            console.error('ToID not provided')
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
    }, [quoteID, user]);



    const goBack = async () => {

        router.push('/members/cbo/quotes/available');

    };

    const downloadPDF = async () => {
        try {
            const quotePDF = await getQuotePDF(quoteID);

            const response = await fetch(quotePDF.url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${customerData.company}_Contract.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert('Failed to download PDF. Please try again later.');
        }
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
                                <h2 className="text-2xl font-bold text-[#001F54]">Price:</h2>
                                <p className="mt-2 text-lg text-gray-800">${costInfo?.finalCost}</p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#001F54]">Sold By:</h2>
                                <p className="mt-2 text-lg text-gray-800">Franchise: {franchiseInfo}</p>
                                <p className="mt-2 text-lg text-gray-800">Owner: {ownerInfo?.firstName} {ownerInfo?.lastName}</p>
                                <p className="mt-2 text-lg text-gray-800">Sold At: {offerTime ? formatDate(offerTime) : 'N/A'}</p>
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
                                        <li>
                                            <strong>Frequency:</strong> {quoteInfo.frequency}
                                        </li>
                                        <li>
                                            <strong>Number of Rooms:</strong> {numOfRooms}
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {/* Package Details */}
                            {quotePackage && (
                                <div>
                                    <h3 className="text-xl font-semibold text-[#001F54]">Package Details</h3>
                                    <p className="mt-2 text-gray-800">
                                        <strong>Package:</strong> {quotePackage.name}
                                    </p>
                                    <p className="mt-1 text-gray-800">
                                        <strong>Cost:</strong> ${costInfo.finalCost}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Tasks in a Scrollable Box */}
                        {quotePackage && (
                            <div>
                                <h4 className="text-lg font-semibold text-[#001F54] mb-4">
                                    Tasks by Room
                                </h4>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-96 overflow-y-auto">

                                    <div className="space-y-6">
                                        {quotePackage.rooms.map((room: any, index: any) => (
                                            <div
                                                key={index}
                                                className="rounded-xl border border-gray-200 bg-white shadow-sm p-5"
                                            >
                                                <h4 className="text-lg font-bold text-[#001F54] mb-2">
                                                    {room.roomName}:{' '}
                                                    <span className="font-normal text-gray-700">
                                                        {roomInfo.find((r: any) => r.roomType === room.roomName)?.sqft?.totalSqft ?? 0} sqft
                                                    </span>
                                                </h4>

                                                <p className="text-gray-700 mb-2">
                                                    <span className="font-semibold">Number of {room.roomName}s:</span>{' '}
                                                    {roomInfo.find((r: any) => r.roomType === room.roomName)?.roomNumber ?? 0}
                                                </p>

                                                <p className="text-gray-800 font-semibold mb-1">Tasks:</p>
                                                <ul className="pl-5 list-disc space-y-1">
                                                    {room.tasks.map((task: any, idx: any) => (
                                                        <li
                                                            key={idx}
                                                            className="flex justify-between text-sm text-gray-600"
                                                        >
                                                            <span className="font-medium">{task.taskName}</span>
                                                            <span className="italic text-gray-400">{task.taskFrequency}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>

                    {/* Accept Quote Actions */}
                    <div className="mt-10 text-center">

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => downloadPDF()}
                                className="px-6 py-3 bg-yellow-500 text-[#001F54] font-semibold rounded-lg hover:bg-yellow-400 transition"
                            >
                                Download Contract PDF
                            </button>
                            <button
                                onClick={() =>
                                    router.push(
                                        `/members/cbo/quote/accepted/site-visit?id=${quoteID}`
                                    )
                                }
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
                            >
                                First Site Visit
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>


    );
};

export default CBOQuote;

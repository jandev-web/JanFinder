'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getQuoteDetails from '@/utils/getQuoteDetails';
import getQuotePDF from '@/utils/getQuotePDF';
import { checkIsOwner } from '@/utils/checkIsOwner';
import { acceptQuoteOwner } from '@/utils/OwnerAcceptQuote';
import makeQuotePDF from '@/utils/generateQuoteDoc'

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

interface OwnerQuoteProps {
  user: any;
  quoteID: any;
}

const OwnerQuote: React.FC<OwnerQuoteProps> = ({ user, quoteID }) => {
  const router = useRouter();
  const [quoteInfo, setQuoteInfo] = useState<any>(null);
  const [costInfo, setCostInfo] = useState<any>(null);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [quotePackage, setQuotePackage] = useState<any>(null);
  const [timestamp, setTimestamp] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  console.log(user)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const roleStatus = await checkIsOwner(user);
        setIsOwner(roleStatus ?? false);

        if (quoteID) {
          await fetchQuoteDetails(quoteID);
        } else {
          console.error('Quote ID not provided');
        }

      } catch (error) {
        console.error('Error fetching user role or quote details:', error);
      }
    };

    fetchData();
  }, [quoteID, user]);

  const fetchQuoteDetails = async (quoteID: string) => {
    try {
      const quoteData = await getQuoteDetails(quoteID);
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
      await acceptQuoteOwner(quoteID, user.franchiseID, user.OwnerID);
      await makeQuotePDF(quoteID, user.franchiseID);
      
      alert('Success')
    } catch (error) {
      console.error('Error accepting quote:', error);
    }
  };



  const goBack = async () => {

    router.push('/members/owner/quotes/available');

  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
  };

  console.log(quoteInfo);
  // Destructure properties only if quoteInfo exists.


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
            Quote Details
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
                <p className="mt-2 text-lg text-gray-800">${costInfo?.finalCost}</p>
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
                      <strong>Customer:</strong> {customerData.firstName}
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

                  <div className="space-y-4">
                    {quotePackage.rooms.map((room: any, index: any) => (
                      <div key={index} className="border-b border-gray-300 pb-4">
                        <h4 className="text-xl font-semibold text-[#001F54] mb-2">
                          {room.roomName}: {roomInfo[room.roomName]} sqft
                        </h4>
                        <ul className="pl-4 space-y-2">
                          {room.tasks.map((task: any, idx: any) => (
                            <li
                              key={idx}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="font-medium">{task.taskName}</span>
                              <span className="italic text-gray-500">
                                {task.taskFrequency}
                              </span>
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
            {!showConfirmation ? (
              <button
                onClick={() => setShowConfirmation(true)}
                className="px-6 py-3 bg-yellow-500 text-[#001F54] font-semibold rounded-lg hover:bg-yellow-400 transition"
              >
                Accept Quote
              </button>
            ) : (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() =>
                    acceptAvailableQuote()
                  }
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
                >
                  Confirm Acceptance
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition"
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

export default OwnerQuote;

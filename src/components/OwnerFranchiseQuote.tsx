'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkIsOwner } from '@/utils/checkIsOwner';
import fetchCBOById from '@/utils/getCBOByID';
interface OwnerFranchiseQuoteProps {
  user: any;
  quoteID: any;
}

const OwnerFranchiseQuote: React.FC<OwnerFranchiseQuoteProps> = ({ user, quoteID }) => {
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
    const [quoteOwner, setQuoteOwner] = useState<string>('');
    const [cboName, setCBOName] = useState<string>('');
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
        const quoteCBO = quoteData.OwnerID
        setQuoteOwner(quoteCBO);
        const cboData = await fetchCBOById(quoteCBO)
        setCBOName(`${cboData.firstName} ${cboData.lastName}`)
  
      } catch (error) {
        console.error('Error fetching quote details:', error);
      }
    };
  
    
  
  
    const goBack = async () => {
  
      router.push('/business/owner/quotes/franchise');
  
    };
  
    const formatDate = (timestamp: string) => {
      const date = new Date(timestamp);
      return `${date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
    };
  
    console.log(quoteInfo);
    // Destructure properties only if quoteInfo exists.
  
  
    return (
        <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <header className="flex items-center mb-10">
            <button
              onClick={() => goBack()}
              className="flex items-center text-blue-700 hover:text-yellow-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="ml-3 text-lg font-semibold">Back</span>
            </button>
            <h1 className="flex-grow text-center text-4xl font-bold text-gray-800">
              Quote Details
            </h1>
          </header>
      
          {/* Main Card */}
          <div className="bg-white shadow-md rounded-lg p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Price */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Price</h2>
                  <p className="mt-3 text-xl text-gray-600">${costInfo?.finalCost}</p>
                </div>
      
                {address && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-1">Facility Address</h3>
                    <p className="mt-2 text-gray-600">
                      {address.street}, {address.city}, {address.state} {address.postalCode}, {address.country}
                    </p>
                  </div>
                )}
      
                {customerData && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-1">Customer Information</h3>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li><span className="font-medium">Company:</span> {customerData.company}</li>
                      <li><span className="font-medium">Customer:</span> {customerData.firstName}</li>
                      <li><span className="font-medium">Email:</span> {customerData.email}</li>
                      <li><span className="font-medium">Phone:</span> {customerData.phone}</li>
                    </ul>
                  </div>
                )}
      
                {/* Created Timestamp */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-1">Created On</h3>
                  <p className="mt-2 text-gray-500">{timestamp ? formatDate(timestamp) : 'N/A'}</p>
                </div>
      
                {/* Quote Information */}
                {quoteInfo && (
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Quote Information</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      <li><span className="font-medium">Facility Type:</span> {quoteInfo.facilityType}</li>
                      <li><span className="font-medium">Square Feet:</span> {quoteInfo.sqft}</li>
                    </ul>
                  </div>
                )}
      
                {/* Package Details */}
                {quotePackage && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-1">Package Details</h3>
                    <p className="mt-2 text-gray-600"><span className="font-medium">Package:</span> {quotePackage.name}</p>
                    <p className="mt-1 text-gray-600"><span className="font-medium">Cost:</span> ${costInfo.finalCost}</p>
                  </div>
                )}
              </div>
      
              {/* Right Column */}
              {quotePackage && (
                <div className="space-y-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Tasks by Room</h4>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-96 overflow-y-auto">
                    <div className="space-y-6">
                      {quotePackage.rooms.map((room: any, index: any) => (
                        <div key={index} className="border-b border-gray-300 pb-4">
                          <h4 className="text-xl font-semibold text-gray-800 mb-2">
                            {room.roomName}: {roomInfo[room.roomName]} sqft
                          </h4>
                          <ul className="pl-4 space-y-2 text-gray-600">
                            {room.tasks.map((task: any, idx: any) => (
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
              )}
      
              {/* Owner Section spanning full width on medium screens */}
              <div className="md:col-span-2">
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-800">Owner By:</h4>
                  <p className="mt-2 text-gray-600">{cboName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
  
    );
  };

export default OwnerFranchiseQuote;

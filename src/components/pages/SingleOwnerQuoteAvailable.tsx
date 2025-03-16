'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getQuoteDetails from '@/utils/getQuoteDetails';
import getQuotePDF from '@/utils/getQuotePDF';
import { checkIsOwner } from '@/utils/checkIsOwner';
import fetchCBOById from '@/utils/getCBOByID';
import getFranchiseInfo from '@/utils/getFranchiseInfo';
import { acceptQuote } from '@/utils/CBOAcceptQuote';

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
  rooms: Room[];
  description: string;
  name: string;
  cost: number;
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
  customerData: CustomerInfo;
  Timestamp: string;
  // Additional fields from your API response:
  quoteDetails?: any;
  costInfo?: any;
  Package?: Package;
  // Include fields like isAccepted, Owner if needed
}

interface OwnerQuoteProps {
  user: any;
  quoteID: any;
  prevPage: any;
}

const OwnerQuote: React.FC<OwnerQuoteProps> = ({ user, quoteID }) => {
  const router = useRouter();
  const [quoteInfo, setQuoteInfo] = useState<QuoteInfo | null>(null);
  
  const [franchiseID, setFranchiseID] = useState<string>('None');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  

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
        if (user.franchiseID) {
          const franInfo = await getFranchiseInfo(user.franchiseID);
          setFranchiseID(franInfo?.FranchiseID);
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
      setQuoteInfo(quoteData);

    } catch (error) {
      console.error('Error fetching quote details:', error);
    }
  };

  const acceptAvailableQuote = async (quoteID: string, franchiseID: string, cboID: string) => {
    try {
      await acceptQuote(quoteID, franchiseID, cboID);
      // Optionally, redirect or update UI after acceptance
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
  const { customerData, Timestamp, costInfo, Package: quotePackage } = quoteInfo || {};

  return (
    <div>
      <button
        className="top-4 left-4 pt-18 text-green-700 hover:text-yellow-500 transition duration-300"
        onClick={() => goBack()}
      >
        Back
      </button>
      <div className="relative max-w-4xl mx-auto bg-gradient-to-b from-green-700 to-white shadow-xl rounded-lg p-10 my-10 transition-all duration-300 ease-in-out">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-4">Price: {cost}</h2>
          {customerData && (
            <div className="mb-4">
              <p className="text-lg font-semibold text-yellow-100">Company: {customerData.company}</p>
              <p className="text-md text-yellow-200">Customer: {customerData.firstName}</p>
              <p className="text-md text-yellow-300">Email: {customerData.email}</p>
              <p className="text-md text-yellow-300">Phone: {customerData.phone}</p>
            </div>
          )}

          <p className="text-md text-yellow-400 mt-4">Created on: {Timestamp ? formatDate(Timestamp) : 'N/A'}</p>

          {quoteInfo && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quote Information:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Facility Type: {quoteInfo.facilityType}</li>
                <li>Square Feet: {sqft}</li>
              </ul>
            </div>
          )}

          {quotePackage && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Package: {quotePackage.name}</h3>
              <p className="text-md text-gray-600 mb-4">Cost: ${quotePackage.cost.toFixed(2)}</p>
              <h4 className="text-lg font-semibold text-gray-800">Tasks by Room:</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-4">
                {quotePackage.rooms.map((room, index) => (
                  <div key={index} className="border-b border-gray-300 pb-4">
                    <h4 className="text-xl font-semibold text-[#001F54] mb-2">{room.roomName}</h4>
                    <ul className="pl-4 space-y-2">
                      {room.tasks.map((task, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex justify-between items-center">
                          <span className="font-medium">{task.taskName}</span>
                          <span className="italic text-gray-500">{task.taskFrequency}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 text-center">
            {!showConfirmation ? (
              <button
                onClick={() => setShowConfirmation(true)}
                className="px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                Accept Quote
              </button>
            ) : (
              <>
                <button
                  onClick={() => acceptAvailableQuote(quoteID, franchiseID, user.sub)}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition mr-4"
                >
                  Confirm Acceptance
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerQuote;

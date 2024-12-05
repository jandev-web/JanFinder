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
  const searchParams = useSearchParams();
  const quoteID = searchParams.get('id');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [quoteInfo, setQuoteInfo] = useState<QuoteInfo | null>(null);
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!quoteID) return; // Exit if quoteID is missing
      try {
        const response = await getQuoteDetails(quoteID);
        console.log(response)
        if (response) {
          setCustomerInfo(response.customerData);  // Assuming `customerInfo` is part of response
          setSelectedPackage(response.Package);
          setQuoteInfo(response.quoteInfo)  
          // Assuming `selectedPackage` is part of response
        } else {
          //router.push('/'); // Redirect if no data is found
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        //router.push('/');
      }
    };

    fetchCustomerData();
  }, [quoteID, router]);

  const handleConfirm = async () => {
    if (!quoteID || !customerInfo) return;
    try {
      const confirmedQuote = await confirmQuote(quoteID);
      const confirmationNumber = confirmedQuote.confirmationNumber
      console.log(confirmationNumber)
      const name = `${customerInfo.firstName} ${customerInfo.lastName}`;
      const queryString = new URLSearchParams({ name }).toString();
      router.push(`/congratulations?${queryString}`);
    } catch (error) {
      console.error("Confirmation failed:", error);
      alert("Failed to confirm. Please try again.");
    }
  };

  if (!customerInfo || !selectedPackage) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold text-green-800 mb-8">Confirm Your Package</h2>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full max-w-2xl border border-gray-300">
        <h3 className="text-2xl font-bold text-green-700 mb-4">Customer Information</h3>
        <p className="text-lg text-gray-700 mb-2"><strong>Name:</strong> {customerInfo.firstName} {customerInfo.lastName} </p>
        <p className="text-lg text-gray-700 mb-2"><strong>Email:</strong> {customerInfo.email}</p>
        <p className="text-lg text-gray-700 mb-2"><strong>Phone:</strong> {customerInfo.phone}</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full max-w-2xl border border-gray-300">
        <h3 className="text-2xl font-bold text-green-700 mb-4">Facility Information</h3>
        <p className="text-lg text-gray-700 mb-2"><strong>Company:</strong> {customerInfo.company}</p>
        <p className="text-lg text-gray-700 mb-2"><strong>Address:</strong> {customerInfo.address.street}, {customerInfo.address.city} {customerInfo.address.state}, {customerInfo.address.postalCode}</p>
        <p className="text-lg text-gray-700 mb-2"><strong>Type:</strong> {quoteInfo?.facilityType}</p>
        <p className="text-lg text-gray-700 mb-2"><strong>Area:</strong> {quoteInfo?.sqft} sqft.</p>
      </div>


      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full max-w-2xl border border-gray-300">
        <h3 className="text-2xl font-bold text-green-700 mb-4">Selected Package: {selectedPackage.name}</h3>
        <p className="text-gray-600 mb-4 italic">{selectedPackage.blurb}</p>
        <p className="text-lg font-semibold text-gray-700 mb-4">Cost: ${selectedPackage.cost.toFixed(2)}</p>

        <div>
          {selectedPackage.tasks.map((room, index) => (
            <div key={index} className="mt-4">
              <h4 className="text-lg font-semibold text-gray-800">{room.roomName}</h4>
              <ul className="list-disc list-inside text-gray-600">
                {room.tasks.map((task, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{task.taskName}</span>: <span className="italic">{task.taskFrequency}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleConfirm}
        className="mt-4 bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition font-semibold"
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default ConfirmationPage;

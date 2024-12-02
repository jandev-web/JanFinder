'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getQuoteDetails from '@/utils/getQuoteDetails';
import getQuotePDF from '@/utils/getQuotePDF';
import { checkIsOwner } from '@/utils/checkIsOwner';
import fetchCBOById from '@/utils/getCBOByID';
import getFranchiseInfo from '@/utils/getFranchiseInfo';

interface Task {
  taskFrequency: string;
  taskName: string;
}

interface Tasks {
  roomName: string; // Add roomName here
  tasks: Task[];
}

interface PackageDetails {
  name: string;
  description: string;
  cost: number;
  tasks: Tasks[];
}

interface QuoteInfo {
  sqft: number;
  facilityType: string;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
}

interface ConfirmedQuote {
  quotePDF: string;
}

interface Quote {
  Timestamp: string;
  Confirmed?: ConfirmedQuote;
  QuoteID: string;
  quoteInfo: QuoteInfo;
  Franchise: string;
  CBO: string;
  Package: PackageDetails;
  customerData: CustomerData;
  AcceptedTimestamp: string;
}

interface OwnerQuoteProps {
  user: any;
  quoteID: any;
  prevPage: any;
}

const OwnerQuote: React.FC<OwnerQuoteProps> = ({ user, quoteID, prevPage }) => {
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [cost, setCost] = useState<string>('Not Set');
  const [sqft, setSqft] = useState<string>('Not Set');
  const [phone, setPhone] = useState<string>('Not Set');
  const [email, setEmail] = useState<string>('Not Set');
  const [customer, setCustomer] = useState<string>('Not Set');
  const [cboName, setCBOName] = useState('None');
  const [franchiseName, setFranchiseName] = useState('None');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roleStatus = await checkIsOwner(user);

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
      setQuote(quoteData);
      const cboID = quoteData.CBO
      if (quoteData.Package?.cost) {
        const costString = `$${quoteData.Package?.cost.toFixed(2)}`
        setCost(costString)
      }
      if (quoteData.quoteInfo?.sqft) {
        const sqftString = quoteData.quoteInfo?.sqft
        setSqft(sqftString)
      }
      if ((quoteData.customerData?.firstName && quoteData.customerData?.firstName != '')|| (quoteData.customerData?.lastName && quoteData.customerData?.firstName != '')) {
        let firstName = ''
        let lastName = ''
        if(quoteData.customerData?.firstName) {
          firstName = quoteData.customerData?.firstName
        }
        if (quoteData.customerData?.lastName) {
          lastName = quoteData.customerData?.lastName
        }
        const customerString = `${firstName} ${lastName}`
        setCustomer(customerString)
      }
      if (quoteData.customerData?.email && quoteData.customerData?.email != '') {
        const emailString = quoteData.customerData?.email
        setEmail(emailString)
      }
      if (quoteData.customerData?.phone && quoteData.customerData?.phone != '') {
        const phoneString = quoteData.customerData?.phone
        setPhone(phoneString)
      }
      const cboData = await fetchCBOById(cboID)
      console.log(cboData)
      const cboFullName = `${cboData.firstName} ${cboData.lastName}`
      setCBOName(cboFullName)
      const franchiseData = await getFranchiseInfo(cboData.franchiseID)
      setFranchiseName(franchiseData.franchiseName)
      console.log(franchiseData)
      if (quoteData.Confirmed?.quotePDF) {
        await handleRetrievePDF(quoteData.Confirmed.quotePDF);
      }


    } catch (error) {
      console.error('Error fetching quote details:', error);
    }
  };

  const handleRetrievePDF = async (quotePDF: string) => {
    try {
      const url = await getQuotePDF(quotePDF);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error retrieving PDF:', error);
    }
  };

  const goBack = async () => {
    try {
      if (prevPage === 'ava') {
        router.push('/members/owner/quotes/available')
      }
      else if (prevPage === 'acc') {
        router.push('/members/owner/quotes/accepted')
      }
    } catch (error) {
      console.error('Error retrieving PDF:', error);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
  };

  if (!quote) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

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
          {prevPage === 'acc' && (
            <div className="mb-4">
              <p className="text-lg font-semibold text-yellow-100">CBO: {cboName}</p>
              <p className="text-md text-yellow-200">Franchise: {franchiseName}</p>
              <p className="text-md text-yellow-300">Accepted on: {formatDate(quote.AcceptedTimestamp)}</p>
            </div>
          )}
          {quote.customerData && (
            <div className="mb-4">
              <p className="text-lg font-semibold text-yellow-100">Company: {quote.customerData.company}</p>
              <p className="text-md text-yellow-200">Customer: {customer}</p>
              <p className="text-md text-yellow-300">Email: {email}</p>
              <p className="text-md text-yellow-300">Phone: {phone}</p>
            </div>
          )}

          <p className="text-md text-yellow-400 mt-4">Created on: {formatDate(quote.Timestamp)}</p>

          {quote.quoteInfo && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quote Information:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Facility Type: {quote.quoteInfo.facilityType}</li>

                <li>Square Feet: {sqft}</li>
              </ul>
            </div>
          )}

          {quote.Package && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Package: {quote.Package.name}</h3>
              <p className="text-md text-gray-600 mb-4">Cost: ${quote.Package.cost.toFixed(2)}</p>
              <h4 className="text-lg font-semibold text-gray-800">Tasks by Room:</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-4">
                {quote.Package.tasks.map((taskGroup, index) => (
                  <li key={index}>
                    <p className="font-bold text-gray-800">{taskGroup.roomName}</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      {taskGroup.tasks.map((task, idx) => (
                        <li key={idx}>{task.taskName} - {task.taskFrequency}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {quote.Confirmed?.quotePDF && (
            <div className="mt-6">
              <h4 className="text-xl font-semibold text-gray-800">Confirmed PDF:</h4>
              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View PDF
                </a>
              ) : (
                <p className="text-gray-600">Loading PDF...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerQuote;

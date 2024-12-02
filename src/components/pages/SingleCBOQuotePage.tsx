'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { acceptQuote } from '@/utils/CBOAcceptQuote';
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
}

interface ConfirmedQuote {
  quotePDF: string;
}

interface Quote {
  Timestamp: string;
  Confirmed?: ConfirmedQuote;
  QuoteID: string;
  chatbotInteraction: string;
  quoteInfo: QuoteInfo;
  Franchise: string;
  CBO: string;
  Package: PackageDetails;
  customerData: CustomerData;
  AcceptedTimestamp: string;
}

interface CBOQuoteProps {
  user: any;
  quoteID: any;
  prevPage: any;
}

const CBOQuote: React.FC<CBOQuoteProps> = ({ user, quoteID, prevPage }) => {
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [franchiseName, setFranchiseName] = useState('None');
  const [franchiseID, setFranchiseID] = useState('None');
  const [cboName, setCBOName] = useState('None');
  const [showConfirmation, setShowConfirmation] = useState(false);

  console.log(prevPage)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user role
        const roleStatus = await checkIsOwner(user);
        setIsOwner(roleStatus ?? false);

        // Fetch CBO data
        if (user?.sub) {
          console.log(user.sub)
          const cboData = await fetchCBOById(user.sub);
          setCBOName(`${cboData.firstName} ${cboData.lastName}`);

          // Fetch franchise info based on CBO's franchiseID
          if (cboData.franchiseID) {
            const franInfo = await getFranchiseInfo(cboData.franchiseID);
            setFranchiseName(franInfo?.franchiseName ?? 'None');
            setFranchiseID(franInfo?.FranchiseID)
          }
        }

        // Fetch quote details
        if (quoteID) {
          await fetchQuoteDetails(quoteID);
        } else {
          console.error('QuoteId not provided');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [quoteID, user]);

  const fetchQuoteDetails = async (quoteID: string) => {
    try {
      const quoteData = await getQuoteDetails(quoteID);
      setQuote(quoteData);
      console.log(quoteData)

      if (quoteData.Confirmed && quoteData.QuotePDF) {
        handleRetrievePDF(quoteData.QuotePDF);
      }
    } catch (error) {
      console.error('Error fetching quote details:', error);
    }
  };

  const acceptAvailableQuote = async (quoteID: string, franchiseID: string, cboID: string) => {
    try {
      //await acceptQuote(quoteID, franchiseID, cboID);
      router.push(`/members/payment?quoteId=${quoteID}`);
    } catch (error) {
      console.error('Error accepting quote:', error);
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
        router.push('/members/cbo/quotes/availableQuotes')
      }
      else if (prevPage === 'acc') {
        router.push('/members/cbo/quotes/acceptedQuotes')
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
    return <div>Loading...</div>;
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
          <h2 className="text-2xl font-bold text-white mb-4">Price: ${quote.Package.cost.toFixed(2)}</h2>
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
              <p className="text-md text-yellow-200">Customer: {quote.customerData.firstName} {quote.customerData.lastName}</p>
              <p className="text-md text-yellow-300">Email: {quote.customerData.email}</p>
            </div>
          )}

          <p className="text-md text-yellow-400 mt-4">Created on: {formatDate(quote.Timestamp)}</p>

          {quote.quoteInfo && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quote Information:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Facility Type: {quote.quoteInfo.facilityType}</li>
                <li>Square Feet: {quote.quoteInfo.sqft}</li>
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

          {/* Accept Quote Button with Confirmation */}
          {prevPage === 'ava' && (
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
          )}

        </div>

      </div>
    </div>
  );
};

export default CBOQuote;

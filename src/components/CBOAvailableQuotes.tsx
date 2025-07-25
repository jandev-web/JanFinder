'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CBOAvaQuoteCard from './CBOAvaQuoteCard';
import LoadingSpinner from '@/components/LoadingScreenPhrase';
import fetchAvailableCBOQuotes from '@/utils/getAvailableQuotesCBO';
import checkFranchiseTemplates from '@/utils/checkForFranTemplates';
import getQuoteDetails from '@/utils/getQuoteDetails';

type Address = {
  city: string;
  postalCode: string;
  state: string;
};

interface Quote {
  QuoteID: string;
  costInfo: {
    finalCost: number;
  };
  CBO: string;
  Timestamp: string;
  Package: {
    name: string;
    cost: number;
  };
  customerData: {
    firstName: string;
    lastName: string;
    company: string;
    address: Address;
  };
  quoteInfo: {
    sqft: string;
  };
}

interface AvaQuotesProps {
  user: any;
}

const CBOAvaQuotes: React.FC<AvaQuotesProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [quotes, setAvaQuotes] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasTemplates, setHasTemplates] = useState(true);
  const [missingMessage, setMissingMessage] = useState('');
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [userAddress, setUserAddress] = useState<Address | null>(null);
  const router = useRouter();
  const cboID = user?.CBOID;
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;


  const handleQuoteClick = (quote: Quote) => {
    if (!hasTemplates) {
      setShowTemplatesModal(true);
    } else {
      router.push(`/members/cbo/quote/available?quoteID=${quote.QuoteID}`);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap's Nominatim reverse geocoding API
          fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
            .then((res) => res.json())
            .then((data) => {
              const addr = data.address;
              setUserAddress({
                city: addr.city || addr.town || addr.village || '',
                state: addr.state || '',
                postalCode: addr.postcode || ''
              });
            })
            .catch((err) => {
              console.error('Reverse geocoding error:', err);
            });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    } else {
      console.log('Geolocation not supported');
    }
  }, []);

  useEffect(() => {
    if (cboID) {
      const fetchQuotes = async () => {
        try {
          const data = await fetchAvailableCBOQuotes(cboID);
          const sellRequests = data?.requests
          if (sellRequests.length > 0) {
            let filteredQuotes = []
            for (let i = 0; i < sellRequests.length; i++) {
              const requestQuoteID = sellRequests[i].QuoteID
              const requestQuote: any = await getQuoteDetails(requestQuoteID)


              const offerTime = sellRequests[i].Timestamp
              const requestID = sellRequests[i].RequestID
              const cost = requestQuote.costInfo.finalCost
              const facility = requestQuote.quoteInfo.facilityType
              const frequency = requestQuote.quoteInfo.frequency
              const sqft = requestQuote.quoteInfo.sqft
              const quotePackage = requestQuote.Package.name
              const company = requestQuote.customerData.company
              const customerAddress = requestQuote.customerData.address
              
              const newQuote = {
                requestID: requestID,
                cost: cost,
                facility: facility,
                frequency: frequency,
                sqft: sqft,
                offerTime: offerTime,
                quotePackage: quotePackage,
                company: company,
                customerAddress: customerAddress
              }
              
    
              filteredQuotes.push(newQuote)
              
            }
            setAvaQuotes(filteredQuotes);
          }

          // Check if the franchise has the required templates
          const franchiseTemplates = await checkFranchiseTemplates(user?.franchiseID);
          console.log("Franchise templates:", franchiseTemplates);
          if (franchiseTemplates.length === 0) {
            setHasTemplates(true);
            setMissingMessage('');
          } else {
            setHasTemplates(false);
            if (franchiseTemplates.length === 1) {
              setMissingMessage(`Your Franchise is missing the ${franchiseTemplates[0]} template`);
            } else if (franchiseTemplates.length === 2) {
              setMissingMessage('Your Franchise is missing both the Quote template and the Contract template');
            }
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching quotes:', error);
          setLoading(false);
        }
      };

      fetchQuotes();
    }
  }, [cboID, user?.franchiseID]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner phrase={'Available Contracts'} />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        className="absolute top-4 left-4 pt-2 pb-10 pl-4 pr-4 text-lg font-semibold text-blue-700 hover:text-yellow-500 transition duration-300"
        onClick={() => router.push('/members/cbo/quotes')}
      >
        &lt; Back to All Quotes
      </button>
      <div className={`p-8 pt-16 text-center transition-all ${showTemplatesModal ? "filter blur-sm" : ""}`}>
        <h1 className="text-4xl font-bold text-blue-800">Available Quotes</h1>
        {(!hasTemplates && missingMessage !== '') && (
          <p className="mt-4 text-red-600 font-semibold">{missingMessage}</p>
        )}
        {quotes.length === 0 ? (
          <div className="mt-4 text-gray-600">No Available Quotes found.</div>
        ) : (
          <ul className="space-y-4 mt-6">
            {quotes.map((quote: any) => (
              <li key={quote.QuoteID}>
                <CBOAvaQuoteCard
                  quote={quote}
                  userAddress={userAddress}
                  timezone={userTimeZone}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal Overlay */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-white p-8 rounded-lg shadow-xl text-center max-w-sm mx-auto">
            <button 
              onClick={() => setShowTemplatesModal(false)} 
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="text-xl font-bold text-red-600 mb-6">{missingMessage}</p>
            <p>Please notify your franchise they are missing templates.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CBOAvaQuotes;

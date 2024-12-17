'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import fetchCBOById from '@/utils/getCBOByID'; // Utility function to fetch CBO details by ID
import { checkIsOwner } from '@/utils/checkIsOwner'; // Utility function to check if the user is an owner
import getCBOQuotes from '@/utils/getCBOQuotes';
import CBOQuoteCard from '../CBOQuoteCard';
import deleteCBO from '@/utils/deleteCBO';
import deleteCBOQuoteID from '@/utils/removeCBOQuoteDB';
import CheckProfilePage from '@/components/CheckProfileComponent'
import SingleCBOQuoteList from '@/components/SingleCBOQuoteList'

interface Address {
  city: string;
  country: string;
  postalCode: string;
  state: string;
  street: string;
}

interface CBO {
  franchiseID: string;
  email: string;
  firstName: string;
  lastName: string;
  CBOID: string;
  address: Address;
  phone: string;
}

interface Quote {
  QuoteID: string;
  Package: {
    name: string;
    cost: number;
  };
  customerData: {
    firstName: string;
    lastName: string;
  };
}

interface SingleCBOPageProps {
  user: any;
}

const SingleCBOPage: React.FC<SingleCBOPageProps> = ({ user }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cbo, setCBO] = useState<CBO | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = searchParams.get('cboID')

  // Fetch CBO details and quotes if the user is an owner and ID is available
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          const data = await fetchCBOById(id as string);
          console.log(data)
          const quotesData = await getCBOQuotes(id as string, 'accepted');
          //console.log(quotesData)
          setCBO(data);
          setQuotes(quotesData.quotes); // Ensure quotes is an array
          //console.log('CBO Data: ', data);
          //console.log(quotes)
        } catch (error) {
          console.error('Error fetching CBO:', error);
          setError('Failed to fetch CBO details.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  const handleQuoteClick = (quote: Quote) => {
    if (cbo) {
      router.push(`/CBO/quote?quoteID=${quote.QuoteID}&cboID=${cbo.CBOID}`);
    }
  };

  const handleDeleteClick = async () => {
    if (cbo) {
      const confirmed = window.confirm(`Are you sure you want to delete ${cbo.firstName} ${cbo.lastName}?`);
      if (confirmed) {
        try {
          setLoading(true);
          await deleteCBO(cbo.CBOID);
          await deleteCBOQuoteID(cbo.franchiseID)
          router.push('/members/owner/CBOs'); // Redirect to the list of CBOs after deletion
        } catch (error) {
          console.error('Error deleting CBO:', error);
          setError('Failed to delete CBO.');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }



  if (!cbo) {
    return <div>CBO not found</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-10">
      {/* Back Button */}
      <button
        className="absolute top-6 left-6 text-blue-800 font-medium hover:text-yellow-500 transition-colors duration-300"
        onClick={() => router.push('/members/owner/CBOs')}
      >
        &larr; Back
      </button>

      {/* Main Content */}
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* CBO Profile Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
              CBO Profile
            </h2>
            <CheckProfilePage cbo={cbo} />
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleDeleteClick}
                className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-red-600 transition-transform duration-300 transform hover:scale-105"
              >
                Delete CBO
              </button>
            </div>
          </div>

          {/* Quotes List Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
              Quotes
            </h2>
            {quotes.length === 0 ? (
              <p className="text-gray-500 text-center">No quotes available</p>
            ) : (
              <SingleCBOQuoteList quotes={quotes} />
            )}
          </div>
        </div>
      </div>
    </div>
  );


};

export default SingleCBOPage;

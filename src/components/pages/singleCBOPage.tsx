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
  const [isOwner, setIsOwner] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = searchParams.get('cboID')
  

  // Check user role on initial render
  useEffect(() => {
    const checkRole = async () => {
      if (user) {
        try {
          const result = await checkIsOwner(user);
          setIsOwner(result !== undefined ? result : false);
        } catch (error) {
          console.error('Error checking user role:', error);
          setError('Failed to check user role.');
        }
      }
      setLoading(false);
    };

    checkRole();
  }, [user]);

  // Fetch CBO details and quotes if the user is an owner and ID is available
  useEffect(() => {
    const fetchData = async () => {
      if (id && isOwner) {
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
  }, [id, isOwner]);

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

  if (!isOwner) {
    return <div>Not authorized to view this page</div>;
  }

  if (!cbo) {
    return <div>CBO not found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-10">
      <button
        className="absolute top-4 left-4 pt-16 text-green-700 hover:text-yellow-500 transition duration-300"
        onClick={() => router.push('/members/owner/CBOs')}
      >
        Back
      </button>
      <div className="container mx-auto">
        {/* Side by Side Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Left: CBO Profile with Delete Button */}
          <div className="flex flex-col items-center bg-white border-l-8 border-yellow-500 shadow-lg rounded-lg p-8">
            <div className="w-full">
              {/* Profile section with fixed height */}
              <div className="min-h-64">
                <CheckProfilePage cbo={cbo} />
              </div>
            </div>

            {/* Delete Button right under profile */}
            <div className="mt-6 w-full flex justify-center">
              <button
                onClick={handleDeleteClick}
                className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
              >
                Delete CBO
              </button>
            </div>
          </div>

          {/* Right: Quotes List */}
          <div className="bg-white border-l-8 border-yellow-500 shadow-lg rounded-lg p-10">
            <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
              Quotes
            </h2>
            {quotes.length === 0 ? (
              <p className="text-gray-600 text-center">No quotes available</p>
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

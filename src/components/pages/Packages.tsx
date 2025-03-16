'use client';

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/loadingScreen';
import PackageComparison from '@/components/PackageCompare';
import PackageCard from '@/components/PackageCard';
import getQuoteDetails from '@/utils/getQuoteDetails';
import getPackageRecs from '@/utils/getPackageRecs';
import QuoteProgressBar from '../QuoteProgressBar';
import { useRouter } from 'next/navigation';
import recPackageUtil from '@/utils/recPackageUtil'
interface Task {
  taskName: string;
  taskFrequency: string;
}

interface Room {
  roomName: string;
  tasks: Task[];
}

interface PackageOption {
  name: string;
  rooms: Room[];
  description: string;
}


const Packages: React.FC = () => {
  const [quoteID, setQuoteID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<PackageOption[] | null>(null);
  const [recPackage, setRecPackage] = useState<PackageOption | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [cost, setCost] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      try {
        if (typeof window !== "undefined") {
          const storedQuoteID = sessionStorage.getItem('customerData');
          
          if (!storedQuoteID) {
            console.warn('No quoteID found in sessionStorage.');
            router.push('/quote');
            return;
          }

          setQuoteID(storedQuoteID);

          console.log(`Fetching quote details for quoteID: ${storedQuoteID}`);
          const details = await getQuoteDetails(storedQuoteID);
          console.log('Quote details:', details);

          const packageInfo = await getPackageRecs(storedQuoteID);
          console.log('Package recommendations:', packageInfo);
          const costInfo = details.costInfo;
          const baseCost = costInfo.baseCost
          const budget = details.quoteInfo.budget
          setCost(baseCost)
          const recPackageName = recPackageUtil(baseCost, budget)

          const newRecPackage = packageInfo.find((pkg: PackageOption) => pkg.name === recPackageName);

          setPackages(packageInfo);

          if (newRecPackage) {
            setRecPackage(newRecPackage);
          }
        }
      } catch (error) {
        console.error('Error fetching quote or package details:', error);
        setError('Failed to load packages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!quoteID) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
        <p className="text-white mt-4">No quote found, please start the process again.</p>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-200 flex flex-col items-center justify-center min-h-screen p-6 bg-cover bg-center">
      {/* Progress Bar */}
      <div className="w-full max-w-4xl bg-white/80 p-4 rounded-lg shadow-md">
        <QuoteProgressBar stepNumber={3} />
      </div>

      {/* Blurb Below Progress Bar */}
      <div className="w-full max-w-4xl mt-4 text-center text-gray-700 bg-white/90 p-4 rounded-lg shadow-md">
        <p className="text-lg">
          You&apos;re almost finished! Simply select one of the Bid2Clean curated cleaning packages tailored specifically to meet the needs of your
          facility.
        </p>
      </div>

      {/* Back Button */}
      {showComparison && (
        <button
          className="absolute top-4 left-4 text-green-700 hover:text-green-500 flex items-center bg-white/70 px-3 py-1 rounded-lg shadow-md"
          onClick={() => setShowComparison(false)}
        >
          <span className="mr-2">&#8592;</span> Back to Recommended
        </button>
      )}

      {showComparison && packages ? (
        <PackageComparison cost={cost} packages={packages} recPackage={recPackage} quoteID={quoteID} />
      ) : (
        <div className="p-6 rounded-xl shadow-lg max-w-4xl w-full bg-white/90 text-gray-800 mt-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
            Our Recommended Package
          </h2>
          {recPackage ? (
            <PackageCard cleanPackage={recPackage} cost={cost} quoteID={quoteID}/>
          ) : (
            <p className="text-center">No recommended package available.</p>
          )}

          <div className="flex justify-center mt-6">
            <button
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition"
              onClick={() => setShowComparison(true)}
            >
              See All Packages
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;

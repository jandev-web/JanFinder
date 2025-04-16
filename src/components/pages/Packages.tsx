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
  const [packageName, setPackageName] = useState<string | null>(null);
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
          setPackageName(recPackageName)
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

  const handleGoBack = () => {
    setShowComparison(false)
  }

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* Progress Bar */}

      <QuoteProgressBar stepNumber={6} />


      {/* Blurb Below Progress Bar */}
      <div className="bg-[#001F54] text-white p-8 rounded-md shadow-lg max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Step <span className='text-yellow-500'>6</span>: Choose your Package</h1>
        <p className="text-xl">
          Please select a cleaning package. For your facility needs and budget we suggest the {packageName} Package.
        </p>
      </div>


      {showComparison && packages ? (
        <PackageComparison onBack={handleGoBack} cost={cost} packages={packages} recPackage={recPackage} quoteID={quoteID} />
      ) : (
        <div className="bg-gradient-to-br from-white to-gray-200 flex flex-col items-center p-8 mb-8 rounded-xl shadow-2xl max-w-2xl w-full border border-yellow-500">
          <h2 className="text-3xl font-bold text-[#001F54] mb-6 text-center">
            Our Recommended Package
          </h2>
          {recPackage ? (
            <PackageCard cleanPackage={recPackage} cost={cost} quoteID={quoteID} />
          ) : (
            <p className="text-center">No recommended package available.</p>
          )}

          <div className="flex justify-center mt-6">
            <button
              className="bg-[#001F54] text-white px-4 py-2 rounded-lg transition"
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

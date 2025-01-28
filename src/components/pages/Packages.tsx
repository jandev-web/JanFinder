'use client';

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/loadingScreen';
import PackageComparison from '@/components/PackageCompare';
import PackageCard from '@/components/PackageCard';
import getQuoteDetails from '@/utils/getQuoteDetails';
import getPackageRecs from '@/utils/getPackageRecs';
import QuoteProgressBar from '../QuoteProgressBar';
import { useRouter } from 'next/navigation';

interface Task {
  taskName: string;
  taskFrequency: string;
}

interface Room {
  roomName: string;
  tasks: Task[];
}

interface Package {
  id: string;
  name: string;
  cost: number;
  description: string;
  tasks: Room[];
  blurb: string;
}

const Packages: React.FC = () => {
  const [quoteID, setQuoteID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<Package[] | null>(null);
  const [recPackage, setRecPackage] = useState<Package | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
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
          const data = await getQuoteDetails(storedQuoteID);
          //console.log('Quote details:', data);

          const packageInfo = await getPackageRecs(storedQuoteID);
          console.log('Package recommendations:', packageInfo);

          const allPackageInfo = packageInfo?.packageInfo;
          const allPackages = allPackageInfo?.allPackages ?? [];
          const packageRec = allPackageInfo?.recPackage;

          setPackages(allPackages);

          if (packageRec) {
            setRecPackage({
              id: packageRec.id,
              name: packageRec.name,
              cost: packageRec.cost,
              description: packageRec.description,
              tasks: packageRec.tasks,
              blurb: packageRec.blurb,
            });
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
          You&apos;re almost finished! Simply select one of the JanFinder curated cleaning packages tailored specifically to meet the needs of your
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
        <PackageComparison packages={packages} recPackage={recPackage} />
      ) : (
        <div className="p-6 rounded-xl shadow-lg max-w-4xl w-full bg-white/90 text-gray-800 mt-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
            Our Recommended Package
          </h2>
          {recPackage ? (
            <PackageCard cleanPackage={recPackage} />
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

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PackageComparison from '@/components/PackageCompare';
import PackageCard from '@/components/PackageCard';
import getQuoteDetails from '@/utils/getQuoteDetails';
import getPackageRecs from '@/utils/getPackageRecs';
import QuoteProgressBar from '../QuoteProgressBar';

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
  const searchParams = useSearchParams();
  const quoteID = searchParams.get('quoteID');

  const [packages, setPackages] = useState<Package[] | null>(null);
  const [recPackage, setRecPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!quoteID) {
        setError('Quote ID is missing');
        setLoading(false);
        return;
      }

      try {
        const data = await getQuoteDetails(quoteID);
        const packageInfo = await getPackageRecs(quoteID);

        const allPackageInfo = packageInfo?.packageInfo;
        const allPackages = allPackageInfo?.allPackages ?? [];
        const packageRec = allPackageInfo?.recPackage;

        setPackages(allPackages);

        const recPackObject: Package = {
          id: packageRec.id,
          name: packageRec.name,
          cost: packageRec.cost,
          description: packageRec.description,
          tasks: packageRec.tasks,
          blurb: packageRec.blurb,
        };

        setRecPackage(recPackObject);
      } catch (err) {
        console.error('Error fetching quote:', err);
        setError('Failed to fetch quote details.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [quoteID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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

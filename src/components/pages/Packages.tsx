'use client';

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/loadingScreen';
import PackageComparison from '@/components/PackageCompare';
import PackageCard from '@/components/PackageCard';
import { updatePackage } from '@/utils/updatePackageChoice';

import updateQuoteCost from '@/utils/updateQuoteCost';
import roundingUtil from '@/utils/roundingUtil';

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

interface QuoteFormProps {
  quoteID: any;
  quotePackage: any;
  quotePackageOptions: any;
  cost: any;
  recPackage: any;
  onNextStep: (stepNumber: number) => void;
  onMoveOn: (moveOn: boolean) => void;
  onChangePackage: (newPackage: any) => void;
}


const Packages: React.FC<QuoteFormProps> = ({ quoteID, cost, quotePackage, quotePackageOptions, recPackage, onNextStep, onMoveOn, onChangePackage }) => {

  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<any>(quotePackageOptions);
  const [newRecPackage, setNewRecPackage] = useState<any>(recPackage);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [packageName, setPackageName] = useState<string | null>(null);
  const [chosenPackage, setChosenPackage] = useState<any>(quotePackage)

  console.log("recPackage", recPackage)
  console.log("quotePackage", quotePackage)
  console.log("quotePackageOptions", quotePackageOptions)
  console.log("cost", cost)

  useEffect(() => {
    if (!chosenPackage || (chosenPackage != quotePackage)) {
      onMoveOn(false);
    }

  }, [chosenPackage]);

  const handlePackageChange = async (pkg: any) => {
    setLoading(true)
    setChosenPackage(pkg);
    onChangePackage(pkg);
  };

  const handleGoBack = () => {
    setShowComparison(false);
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





  return (
    <div className="flex flex-col">

      <div className="bg-[#001F54] text-white p-8 rounded-md shadow-lg max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Step <span className='text-yellow-500'>6</span>: Choose your Package</h1>
        <p className="text-xl">
          Please select a cleaning package. For your facility needs and budget we suggest the {packageName} Package.
        </p>
      </div>


      {showComparison && packages ? (
        <PackageComparison onNext={onNextStep} onBack={handleGoBack} onChangePackage={handlePackageChange} cost={cost} packages={packages} recPackage={newRecPackage} quoteID={quoteID} />
      ) : (
        <div>
          <div className="bg-gradient-to-br from-white to-gray-200 flex flex-col items-center p-8 mb-8 rounded-xl shadow-2xl max-w-2xl w-full border border-yellow-500">
            <h2 className="text-3xl font-bold text-[#001F54] mb-6 text-center">
              Our Recommended Package
            </h2>
            {recPackage ? (
              <PackageCard cleanPackage={recPackage} onNext={onNextStep} cost={cost} quoteID={quoteID} onChangePackage={handlePackageChange} />
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
          <div className="bg-gradient-to-br from-white to-gray-200 flex flex-col items-center p-8 mb-8 rounded-xl shadow-2xl max-w-2xl w-full border border-yellow-500">
            <h2 className="text-3xl font-bold text-[#001F54] mb-6 text-center">
              Your Chosen Package
            </h2>
            {recPackage ? (
              <PackageCard cleanPackage={quotePackage} onNext={onNextStep} cost={cost} quoteID={quoteID} onChangePackage={handlePackageChange} />
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
        </div>
      )}
    </div>
  );
};

export default Packages;

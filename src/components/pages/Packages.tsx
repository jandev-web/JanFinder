'use client';

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/loadingScreen';
import PackageComparison from '@/components/PackageCompare';
import PackageCard from '@/components/PackageCard';
import { updatePackage } from '@/utils/updatePackageChoice';

import updateQuoteCost from '@/utils/updateQuoteCost';
import roundingUtil from '@/utils/roundingUtil';

import recPackageUtil from '@/utils/recPackageUtil'
import { on } from 'events';

import GoldRec from '../GoldRec';

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
  onMoveBack: (moveBack: boolean) => void;
  onChangePackage: (newPackage: any) => void;
  onUpdateCost: (cost: any) => void;
  onHideBar: (hideBar: boolean) => void;
  onCanClick: (step: any, canClick: boolean) => void;

}


const Packages: React.FC<QuoteFormProps> = ({ onCanClick, quoteID, cost, quotePackage, quotePackageOptions, recPackage, onNextStep, onMoveOn, onMoveBack, onChangePackage, onUpdateCost, onHideBar }) => {

  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<any>(quotePackageOptions);
  const [newRecPackage, setNewRecPackage] = useState<any>(recPackage);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [packageName, setPackageName] = useState<string | null>(null);
  const [chosenPackage, setChosenPackage] = useState<any>(quotePackage)

  const [showConfirmation, setShowConfirmation] = useState(false)
  const bronzePackage = packages.find((pkg: PackageOption) => pkg.name === 'Pure Essentials');
  const silverPackage = packages.find((pkg: PackageOption) => pkg.name === 'Radiant Results');
  const goldPackage = packages.find((pkg: PackageOption) => pkg.name === 'Elite Pristine');

  const [bronzeRec, setBronzeRec] = useState(false);
  const [silverRec, setSilverRec] = useState(false);
  const [goldRec, setGoldRec] = useState(false);

  const [bronzeChosen, setBronzeChosen] = useState(false)
  const [silverChosen, setSilverChosen] = useState(false)
  const [goldChosen, setGoldChosen] = useState(false)

  const bronzeCost = roundingUtil(cost * 0.64);
  const silverCost = roundingUtil(cost / 1.2);
  const goldCost = roundingUtil(cost);

  console.log("recPackage", recPackage)
  console.log("quotePackage", quotePackage)
  console.log("quotePackageOptions", quotePackageOptions)
  console.log("cost", cost)
  console.log("bronzeCost", bronzeCost)
  console.log("silverCost", silverCost)
  console.log("goldCost", goldCost)

  useEffect(() => {
    if (!chosenPackage || (chosenPackage != quotePackage)) {
      onMoveOn(false);
    }

  }, [chosenPackage]);

  useEffect(() => {
    setLoading(true)
    setBronzeRec(recPackage?.name === bronzePackage?.name);
    setSilverRec(recPackage?.name === silverPackage?.name);
    setGoldRec(recPackage?.name === goldPackage?.name);

    setBronzeChosen(quotePackage?.name === bronzePackage?.name)
    setSilverChosen(quotePackage?.name === silverPackage?.name)
    setGoldChosen(quotePackage?.name === goldPackage?.name)
    setLoading(false)

  }, [recPackage, quotePackage, bronzePackage, silverPackage, goldPackage]);

  const handlePackageChange = async (pkg: any) => {
    setLoading(true)
    setChosenPackage(pkg);
    onChangePackage(pkg);
    onNextStep(7)
    onCanClick(7, true)
  };

  const handleGoBack = () => {
    setShowComparison(false);
  }


  const handleShowComparison = () => {
    onMoveBack(false);
    onMoveOn(false)
    setShowComparison(true);
    onHideBar(true)

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
    <div className={`flex flex-col items-center ${showComparison ? 'pt-16' : ''}`}>




      {showComparison && packages ? (
        <PackageComparison bronzeCost={bronzeCost} silverCost={silverCost} goldCost={goldCost} bronzeChosen={bronzeChosen} silverChosen={silverChosen} goldChosen={goldChosen} bronzeRec={bronzeRec} silverRec={silverRec} goldRec={goldRec} bronzePackage={bronzePackage} silverPackage={silverPackage} goldPackage={goldPackage} onBack={handleGoBack} onHideBar={onHideBar} onMoveOn={onMoveOn} onMoveBack={onMoveBack} onUpdateCost={onUpdateCost} onChangePackage={handlePackageChange} packages={packages} recPackage={newRecPackage} quotePackage={quotePackage} quoteID={quoteID} />
      ) : (

        <div className='flex flex-col items-center'>
          <div className="bg-[#001F54] text-white p-8 rounded-md shadow-lg max-w-2xl text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Step <span className='text-yellow-500'>6</span>: Choose your Package</h1>
            <p className="text-xl">
              Please select a cleaning package. For your facility needs and budget we suggest the {packageName} Package.
            </p>
          </div>
          <div className='flex flex-row w-full justify-between gap-8'>
            <div className="bg-gradient-to-br from-white to-gray-200 flex flex-col items-center p-8 mb-8 rounded-xl shadow-2xl max-w-2xl w-full border border-[#001F54]">
              <h2 className="text-3xl font-bold text-[#001F54] mb-6 text-center">
                Our Recommended Package
              </h2>
              {recPackage ? (
                <PackageCard type={'rec'} onUpdateCost={onUpdateCost} bronzeCost={bronzeCost} silverCost={silverCost} goldCost={goldCost} bronzeChosen={bronzeChosen} silverChosen={silverChosen} goldChosen={goldChosen} bronzeRec={bronzeRec} silverRec={silverRec} goldRec={goldRec} cleanPackage={recPackage} onNext={onNextStep} quoteID={quoteID} onChangePackage={handlePackageChange} />
              ) : (
                <p className="text-center">No recommended package available.</p>
              )}
            </div>

            {quotePackage && (
              <div className="bg-gradient-to-br from-white to-gray-200 flex flex-col items-center p-8 mb-8 rounded-xl shadow-2xl max-w-2xl w-full border border-[#001F54]">
                <h2 className="text-3xl font-bold text-[#001F54] mb-6 text-center">
                  Your Selected Package
                </h2>

                <div className='pt-12'>
                  <PackageCard type={'chosen'} onUpdateCost={onUpdateCost} bronzeCost={bronzeCost} silverCost={silverCost} goldCost={goldCost} bronzeChosen={bronzeChosen} silverChosen={silverChosen} goldChosen={goldChosen} bronzeRec={bronzeRec} silverRec={silverRec} goldRec={goldRec} cleanPackage={quotePackage} onNext={onNextStep} quoteID={quoteID} onChangePackage={handlePackageChange} />
                </div>
              </div>
            )}




          </div>
          <div className="flex justify-center mt-6">
            <button
              className="bg-[#001F54] text-white px-4 py-2 rounded-lg transition"
              onClick={handleShowComparison}
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

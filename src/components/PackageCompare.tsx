import React, { useState, useEffect } from 'react';
import Bronze from '@/components/Bronze';
import BronzeServiceList from './BronzeServiceList';
import Silver from '@/components/Silver';
import SilverServiceList from './SilverServiceList';
import Gold from '@/components/Gold';
import { updatePackage } from '@/utils/updatePackageChoice';
import { useRouter } from 'next/navigation';
import GoldBox from '@/components/MetallicBox'
import updateQuoteCost from '@/utils/updateQuoteCost';
import roundingUtil from '@/utils/roundingUtil';
import Button from '@mui/material/Button';
import LoadingSpinner from './loadingScreen';
import GoldServiceList from './GoldServiceList';

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
interface PackageComparisonProps {
  onBack: () => void;
  packages: PackageOption[];
  recPackage: PackageOption;
  bronzeCost: any;
  silverCost: any;
  goldCost: any;
  quoteID: any;
  quotePackage: any;
  bronzePackage: any;
  silverPackage: any;
  goldPackage: any;
  bronzeRec: any;
  silverRec: any;
  goldRec: any;
  bronzeChosen: any;
  silverChosen: any;
  goldChosen: any;
  onMoveBack: (moveBack: boolean) => void;
  onMoveOn: (moveOn: boolean) => void;
  onChangePackage: (pkg: any) => void;
  onHideBar: (hideBar: boolean) => void;
  onUpdateCost: (cost: any) => void;
}

const PackageComparison: React.FC<PackageComparisonProps> = ({ bronzeCost, silverCost, goldCost, bronzeRec, silverRec, goldRec, bronzeChosen, goldChosen, silverChosen, bronzePackage, silverPackage, goldPackage, onBack, onHideBar, onMoveBack, onMoveOn, onChangePackage, onUpdateCost, quotePackage, packages, recPackage, quoteID }) => {

  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const handleGoBack = () => {
    onMoveBack(true);
    onMoveOn(true)
    onHideBar(false)
    onBack()
  }

  const handleSelectPackage = async (pkg: any) => {
    try {
      const response = await updatePackage(quoteID, pkg);
      onChangePackage(pkg);
      if (pkg.name === 'Radiant Results') {
        await updateQuoteCost(quoteID, { finalCost: silverCost });
        onUpdateCost(silverCost)
      }
      if (pkg.name === 'Elite Pristine') {
        await updateQuoteCost(quoteID, { finalCost: goldCost });
        onUpdateCost(goldCost)
      }
      if (pkg.name === 'Pure Essentials') {
        
        await updateQuoteCost(quoteID, { finalCost: bronzeCost });
        onUpdateCost(bronzeCost)
      }

      if (response.updatedAttributes) {
        setConfirmationMessage('Package updated successfully!');

      } else {
        setConfirmationMessage('Failed to update package. Please try again.');
      }
      onMoveBack(true)
      onHideBar(false)
      onBack()
    } catch (error) {
      console.error('Error updating package:', error);
      setConfirmationMessage('Error updating package. Please try again.');
    }
  };


  return (
    <div className="bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-md p-8 pb-32 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-center text-[#001F54] mb-8">Compare Our Packages</h2>
      <button
        onClick={handleGoBack}
        className="group flex items-center text-[#001F54] hover:text-yellow-500 mb-8"
      >
        <span>
          {/* Default Arrow Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 block group-hover:hidden"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {/* Hover Arrow Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 hidden group-hover:block"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
          </svg>
        </span>
        <span>Back to Recommended</span>
      </button>
      <div className='flex flex-col pb-32'>
        <div className="flex flex-row w-full justify-between gap-8">
          {/* Bronze Package Card */}
          <div className="flex flex-col w-full">
            <Bronze
              cost={bronzeCost}
              pkg={bronzePackage}
              rec={bronzeRec}
              chosen={bronzeChosen}
              handleSelect={() => handleSelectPackage(bronzePackage)}
            />
          </div>

          {/* Silver Package Card */}
          <div className="flex flex-col w-full">
            <Silver
              cost={silverCost}
              pkg={silverPackage}
              rec={silverRec}
              chosen={silverChosen}
              handleSelect={() => handleSelectPackage(silverPackage)}
            />
          </div>

          {/* Gold Package Card */}
          <div className="flex flex-col w-full">
            <Gold
              cost={goldCost}
              pkg={goldPackage}
              rec={goldRec}
              chosen={goldChosen}
              handleSelect={() => handleSelectPackage(goldPackage)}
            />
          </div>
        </div>
        <div className="flex flex-row w-full justify-between gap-8 mb-8">
          {/* Bronze Package Card */}
          <div className="flex flex-col w-full">
            <BronzeServiceList
              rec={bronzeRec}
              pkg={bronzePackage}
            />
          </div>

          {/* Silver Package Card */}
          <div className="flex flex-col w-full">
            <SilverServiceList
              rec={silverRec}
              pkg={silverPackage}
            />
          </div>

          {/* Gold Package Card */}
          <div className="flex flex-col w-full">
            <GoldServiceList
              rec={goldRec}
              pkg={goldPackage}
            />
          </div>
        </div>
      </div>


    </div>


  );
};

export default PackageComparison;
import React, { useState, useEffect } from 'react';
import { updatePackage } from '@/utils/updatePackageChoice';

import updateQuoteCost from '@/utils/updateQuoteCost';
import roundingUtil from '@/utils/roundingUtil';

import GoldRec from './GoldRec';
import SilverRec from './SilverRec';
import BronzeRec from './BronzeRec';

interface Task {
  taskName: string;
  taskFrequency: string;
}

interface Room {
  roomName: string;
  tasks: Task[];
}

interface CleanPackage {
  name: string;
  rooms: Room[];
  description: string;
}

interface PackageCardProps {
  cleanPackage: CleanPackage;
  bronzeCost: any;
  silverCost: any;
  goldCost: any;
  quoteID: any;
  onNext: (stepNumber: number) => void;
  onChangePackage: (pkg: any) => void;
  onUpdateCost: (cost: any) => void;
  bronzeRec: any;
  silverRec: any;
  goldRec: any;
  bronzeChosen: any;
  silverChosen: any;
  goldChosen: any;
  type: any;
}

const PackageCard: React.FC<PackageCardProps> = ({ type, bronzeCost, silverCost, goldCost, bronzeRec, silverRec, goldRec, bronzeChosen, goldChosen, silverChosen, cleanPackage, onChangePackage, onUpdateCost, quoteID, onNext }) => {
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [finalCost, setFinalCost] = useState(goldCost);
  console.log(goldCost)
  console.log(finalCost)
  

  useEffect(() => {
    if (cleanPackage.name === 'Radiant Results') {
      setFinalCost(silverCost)
    } else if (cleanPackage.name === 'Pure Essentials') {
      setFinalCost(bronzeCost);
    }
  }, [cleanPackage.name]);

  const handleSelectPackage = async (pkg: CleanPackage) => {
    try {
      const response = await updatePackage(quoteID, pkg);
      const roundCost = roundingUtil(finalCost)
      await updateQuoteCost(quoteID, { finalCost: roundCost });
      onUpdateCost(roundCost)
      onChangePackage(pkg);
      
      if (response.updatedAttributes) {
        setConfirmationMessage('Package updated successfully!');
      } else {
        //setConfirmationMessage('Failed to update package. Please try again.');
      }
    } catch (error) {
      console.error('Error updating package:', error);
      setConfirmationMessage('Error updating package. Please try again.');
    }
  };

  return (
    <div className="">
      {((goldRec && (type === 'rec') )|| (goldChosen && (type === 'chosen'))) && (
        <GoldRec chosen={goldChosen} pkg={cleanPackage} rec={goldRec} cost={goldCost} handleSelect={() => handleSelectPackage(cleanPackage)}/>
      )}
      {((silverRec && (type === 'rec'))|| (silverChosen && (type === 'chosen'))) && (
        <SilverRec chosen={silverChosen} pkg={cleanPackage} rec={silverRec} cost={silverCost} handleSelect={() => handleSelectPackage(cleanPackage)}/>
      )}
      {((bronzeRec && (type === 'rec'))|| (bronzeChosen && (type === 'chosen'))) && (
        <BronzeRec chosen={bronzeChosen} pkg={cleanPackage} rec={bronzeRec} cost={bronzeCost} handleSelect={() => handleSelectPackage(cleanPackage)}/>
      )}
      
      

      

      
    </div>
  );
};

export default PackageCard;

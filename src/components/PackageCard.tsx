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
  chosen: boolean;
  bronzeRec: any;
  silverRec: any;
  goldRec: any;
  bronzeChosen: any;
  silverChosen: any;
  goldChosen: any;
}

const PackageCard: React.FC<PackageCardProps> = ({ bronzeCost, silverCost, goldCost, bronzeRec, silverRec, goldRec, bronzeChosen, goldChosen, silverChosen, cleanPackage, chosen, onChangePackage, quoteID, onNext }) => {
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [finalCost, setFinalCost] = useState(goldCost);

  

  useEffect(() => {
    let calculatedCost;
    if (cleanPackage.name === 'Radiant Results') {
      calculatedCost = silverCost
    } else if (cleanPackage.name === 'Pure Essentials') {
      calculatedCost = bronzeCost;
    }
    setFinalCost(calculatedCost);
  }, [cleanPackage.name]);

  const handleSelectPackage = async (pkg: CleanPackage) => {
    try {
      const response = await updatePackage(quoteID, pkg);
      const roundCost = roundingUtil(finalCost)
      await updateQuoteCost(quoteID, { finalCost: roundCost });
      onChangePackage(pkg);
      
      if (response.updatedAttributes) {
        setConfirmationMessage('Package updated successfully!');
        onNext(6)
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
      {((goldRec && !chosen )|| (goldChosen && chosen)) && (
        <GoldRec chosen={chosen} pkg={cleanPackage} rec={!chosen} cost={goldCost} handleSelect={() => handleSelectPackage(cleanPackage)}/>
      )}
      {((silverRec && !chosen )|| (silverChosen && chosen)) && (
        <SilverRec chosen={chosen} pkg={cleanPackage} rec={!chosen} cost={silverCost} handleSelect={() => handleSelectPackage(cleanPackage)}/>
      )}
      {((bronzeRec && !chosen )|| (bronzeChosen && chosen)) && (
        <BronzeRec chosen={chosen} pkg={cleanPackage} rec={!chosen} cost={bronzeCost} handleSelect={() => handleSelectPackage(cleanPackage)}/>
      )}
      
      

      

      
    </div>
  );
};

export default PackageCard;

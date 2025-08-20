import React, { useState, useEffect } from 'react';
import { updatePackage } from '@/utils/updatePackageChoice';

import updateQuoteCost from '@/utils/updateQuoteCost';
import roundingUtil from '@/utils/roundingUtil';

import GoldRec from './GoldRec';
import SilverRec from './SilverRec';
import BronzeRec from './BronzeRec';



interface PackageCardProps {
  quotePackage: any;
  recPackage: any;
  quoteID: any;
  onNext: (stepNumber: number) => void;
  onChangePackage: (pkg: any) => void;
  type: any;
}

const PackageCard: React.FC<PackageCardProps> = ({ type, quotePackage, recPackage, onChangePackage, quoteID, onNext }) => {
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const handleSelectPackage = async (pkg: any) => {
    try {
      const response = await updatePackage(quoteID, pkg);
      onChangePackage(pkg);
      
      if (response.message === 'OK') {
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
      {(((recPackage.packageType === 'top') && (type === 'rec') )|| ((quotePackage?.packageType === 'top') && (type === 'chosen'))) && (
        <GoldRec quotePackage={quotePackage} recPackage={recPackage} type={type} handleSelect={handleSelectPackage}/>
      )}
      {(((recPackage.packageType === 'middle') && (type === 'rec') )|| ((quotePackage?.packageType === 'middle') && (type === 'chosen'))) && (
        <SilverRec quotePackage={quotePackage} recPackage={recPackage} type={type} handleSelect={handleSelectPackage}/>
      )}
      {(((recPackage.packageType === 'bottom') && (type === 'rec') )|| ((quotePackage?.packageType === 'bottom') && (type === 'chosen'))) && (
        <BronzeRec quotePackage={quotePackage} recPackage={recPackage} type={type} handleSelect={handleSelectPackage}/>
      )}
      
      

      

      
    </div>
  );
};

export default PackageCard;

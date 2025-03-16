import React, { useState, useEffect } from 'react';
import Bronze from '@/components/Bronze';
import Silver from '@/components/Silver';
import Gold from '@/components/Gold';
import { updatePackage } from '@/utils/updatePackageChoice';
import { useRouter } from 'next/navigation';
import GoldBox from '@/components/MetallicBox'
import updateQuoteCost from '@/utils/updateQuoteCost';
import roundingUtil from '@/utils/roundingUtil';
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
  packages: PackageOption[];
  recPackage: PackageOption | null;
  cost: any;
  quoteID: any;
}

const PackageComparison: React.FC<PackageComparisonProps> = ({ packages, recPackage, cost, quoteID }) => {
  const bronzePackage = packages.find((pkg) => pkg.name === 'Pure Essentials');
  const silverPackage = packages.find((pkg) => pkg.name === 'Radiant Results');
  const goldPackage = packages.find((pkg) => pkg.name === 'Elite Pristine');
  const [bronzeRec, setBronzeRec] = useState(false);
  const [silverRec, setSilverRec] = useState(false);
  const [goldRec, setGoldRec] = useState(false);



  const bronzeCost= roundingUtil(cost * 0.64);
  const silverCost = roundingUtil(cost / 1.2);
  const goldCost = roundingUtil(cost);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setBronzeRec(recPackage?.name === bronzePackage?.name);
    setSilverRec(recPackage?.name === silverPackage?.name);
    setGoldRec(recPackage?.name === goldPackage?.name);

  }, [recPackage, bronzePackage, silverPackage, goldPackage]);

  const handleSelectPackage = async (pkg: PackageOption) => {
    try {
      const response = await updatePackage(quoteID, pkg);
      if (pkg.name === 'Radiant Results') {
        await updateQuoteCost(quoteID, { finalCost: silverCost });
      }
      if (pkg.name === 'Elite Pristine') {
        await updateQuoteCost(quoteID, { finalCost: goldCost });
      }
      if (pkg.name === 'Pure Essentials') {
        await updateQuoteCost(quoteID, { finalCost: bronzeCost });
      }
      
      if (response.updatedAttributes) {
        setConfirmationMessage('Package updated successfully!');
        setTimeout(() => {
          
          router.push(`/get-a-quote/confirm`);
        }, 1000);
      } else {
        setConfirmationMessage('Failed to update package. Please try again.');
      }
    } catch (error) {
      console.error('Error updating package:', error);
      setConfirmationMessage('Error updating package. Please try again.');
    }
  };

  console.log(packages)
  console.log(recPackage)
  return (
    <div className="p-8 bg-gray-100 space-y-8">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-8">Compare Our Packages</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {bronzePackage && (
          <Bronze
            cost={bronzeCost}
            pkg={bronzePackage}
            rec={bronzeRec}
            handleSelect={() => handleSelectPackage(bronzePackage)}
          />
        )}
        {silverPackage && (
          <Silver
            cost={silverCost}
            pkg={silverPackage}
            rec={silverRec}
            handleSelect={() => handleSelectPackage(silverPackage)}
          />
        )}
        {goldPackage && (
          <Gold
            cost={goldCost}
            pkg={goldPackage}
            rec={goldRec}
            handleSelect={() => handleSelectPackage(goldPackage)}
          />
        )}
      </div>
    </div>
  );
};

export default PackageComparison;

import React, { useState, useEffect } from 'react';
import Bronze from '@/components/Bronze';
import Silver from '@/components/Silver';
import Gold from '@/components/Gold';
import { updatePackage } from '@/utils/updatePackageChoice';
import { useRouter } from 'next/navigation';
import GoldBox from '@/components/MetallicBox'
interface Package {
  name: string;
  description: string;
  cost: number;
  tasks: {
    roomName: string;
    tasks: { taskName: string; taskFrequency: string }[];
  }[];
  blurb: string;
  id: string;
}
interface PackageComparisonProps {
  packages: Package[];
  recPackage: Package | null;
}

const PackageComparison: React.FC<PackageComparisonProps> = ({ packages, recPackage }) => {
  const bronzePackage = packages.find((pkg) => pkg.name === 'Pure Essentials');
  const silverPackage = packages.find((pkg) => pkg.name === 'Radiant Results');
  const goldPackage = packages.find((pkg) => pkg.name === 'Elite Pristine');
  const [bronzeRec, setBronzeRec] = useState(false);
  const [silverRec, setSilverRec] = useState(false);
  const [goldRec, setGoldRec] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setBronzeRec(recPackage?.name === bronzePackage?.name);
    setSilverRec(recPackage?.name === silverPackage?.name);
    setGoldRec(recPackage?.name === goldPackage?.name);
  }, [recPackage, bronzePackage, silverPackage, goldPackage]);

  const handleSelectPackage = async (pkg: Package) => {
    try {
      const response = await updatePackage(pkg);
      const id = pkg?.id
      if (response.success === true) {
        setConfirmationMessage('Package updated successfully!');
        setTimeout(() => {
          const queryString = new URLSearchParams({ id }).toString();
          router.push(`/confirmation?${queryString}`);
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
            pkg={bronzePackage}
            rec={bronzeRec}
            handleSelect={() => handleSelectPackage(bronzePackage)}
          />
        )}
        {silverPackage && (
          <Silver
            pkg={silverPackage}
            rec={silverRec}
            handleSelect={() => handleSelectPackage(silverPackage)}
          />
        )}
        {goldPackage && (
          <Gold
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

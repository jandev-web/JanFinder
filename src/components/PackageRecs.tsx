'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { updatePackage } from '../utils/updatePackageChoice';



const PackageRecommendations: React.FC = () => {
  const router = useRouter();
  

    //router.push(`/finalQuote?`);
  

  
  return (
    <div className="package-recommendations-container">
      <h2>Recommended Packages</h2>
      
    </div>
  );
};

export default PackageRecommendations;

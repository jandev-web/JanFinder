// src/components/pages/Owner/index.tsx (your prior "OwnerPage")
// This is a CLIENT component that receives ownerData from the server.
'use client';

import React from 'react';
import LoadingSpinner from '@/components/loadingScreen';
import OwnerComponent from '../OwnerComponent';
import OwnerHeader from '../OwnerHeader';
import OwnerFooter from '../OwnerFooter';

type OwnerProps = {
  ownerData: any; // type to your Owner model shape if you have it
};

const Owner: React.FC<OwnerProps> = ({ ownerData }) => {
  if (!ownerData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="pb-14">
        <OwnerHeader user={ownerData} />
      </div>
      <OwnerComponent user={ownerData} />
      <OwnerFooter />
    </div>
  );
};

export default Owner;

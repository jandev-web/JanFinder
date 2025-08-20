// src/components/pages/OwnerAvailableQuotesPage.tsx
'use client';

import React from 'react';
import LoadingSpinner from '@/components/loadingScreen';
import OwnerAvaQuotes from '@/components/OwnerAvailableQuotes';
import OwnerFooter from '../OwnerFooter';
import OwnerHeader from '../OwnerHeader';

type OwnerAvaQuotesPageProps = {
  ownerData: any; // type to your Owner model if available
};

const OwnerAvaQuotesPage: React.FC<OwnerAvaQuotesPageProps> = ({ ownerData }) => {
  if (!ownerData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pb-10">
        <OwnerHeader user={ownerData} />
      </div>

      <div className="pt-24">
        <OwnerAvaQuotes user={ownerData} />
      </div>

      <OwnerFooter />
    </div>
  );
};

export default OwnerAvaQuotesPage;

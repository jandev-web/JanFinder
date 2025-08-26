// src/components/pages/OwnerAvailableQuotesPage.tsx
'use client';

import React from 'react';
import LoadingSpinner from '@/components/loadingScreen';
import OwnerAvaQuotes from '@/components/OwnerAvailableQuotes';
import OwnerFooter from '../OwnerFooter';
import OwnerHeader from '../OwnerHeader';

type OwnerAvaQuotesPageProps = {
  ownerData: any;
  quotes: any;
  franchise: any;
};

const OwnerAvaQuotesPage: React.FC<OwnerAvaQuotesPageProps> = ({ ownerData, quotes, franchise }) => {
  if (!ownerData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col min-h-screen">
      <div className="pb-10">
        <OwnerHeader user={ownerData} />
      </div>

      <div className="pt-24">
        <OwnerAvaQuotes user={ownerData} quotes={quotes} franchise={franchise}/>
      </div>

      <OwnerFooter />
    </div>
  );
};

export default OwnerAvaQuotesPage;

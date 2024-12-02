'use client';

import React from 'react';


import OwnerHeader from '@/components/OwnerHeader';
import OwnerAvaQuotes from '@/components/OwnerAvailableQuotes'


import { useUser } from '@/components/UserContext';


const AvaQuotesPage: React.FC = () => {
  const { attributes } = useUser();
  const user = attributes


  return (

    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pt-10">
        <OwnerHeader user={user} />
      </div>
      <div className="flex-1 flex pt-10">
      <OwnerAvaQuotes user={user} />
      </div>
    </div>

  );
};

export default AvaQuotesPage;

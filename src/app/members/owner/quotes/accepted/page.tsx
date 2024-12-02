'use client';

import React from 'react';
import fetchFilteredQuotes from '@/utils/getFilteredQuotesOwner';
import OwnerAccQuotes from '@/components/OwnerAcceptedQuotes'
import OwnerHeader from '@/components/OwnerHeader';


import { useUser } from '@/components/UserContext';


const AllQuotesPage: React.FC = () => {
  const { attributes } = useUser();
  const user = attributes


  return (

    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pt-10">
        <OwnerHeader user={user} />
      </div>
      <div className="flex-1 flex pt-10">
      <OwnerAccQuotes user={user} />
      </div>
    </div>

  );
};

export default AllQuotesPage;

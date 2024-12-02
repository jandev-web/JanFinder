'use client';

import React from 'react';


import CBOHeader from '@/components/CBOHeader';
import AllQuotesCBO from '@/components/pages/AllQuotesCBO';


import { useUser } from '@/components/UserContext';




const AllQuotesPage: React.FC = () => {
  const { attributes } = useUser();
  const currentUser = attributes


  return (

    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pt-10">
        <CBOHeader user={currentUser} />
      </div>
      <div className="flex-1 flex pt-10">
        <AllQuotesCBO user={currentUser} />
      </div>
    </div>

  );
};

export default AllQuotesPage;

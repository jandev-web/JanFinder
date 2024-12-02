'use client';

import React from 'react';


import OwnerHeader from '@/components/OwnerHeader';
import AllQuotes from '@/components/pages/AllQuotes';


import { useUser } from '@/components/UserContext';
import { signOut } from 'aws-amplify/auth';



const AllQuotesPage: React.FC = () => {
  const { attributes } = useUser();
  const currentUser = attributes


  return (

    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pt-10">
        <OwnerHeader user={currentUser} />
      </div>
      <div className="flex-1 flex pt-10">
        <AllQuotes user={currentUser} />
      </div>
    </div>

  );
};

export default AllQuotesPage;

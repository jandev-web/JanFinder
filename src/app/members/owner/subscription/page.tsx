'use client';

import React from 'react';

import OwnerSubscription from '@/components/pages/OwnerSubscriptionPage';

import OwnerHeader from '@/components/OwnerHeader';
import { useUser } from '@/components/UserContext';


const OwnerSubPage = () => {
  const { attributes } = useUser();
  const user = attributes
  

  
  return (

    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pt-10">
      <OwnerHeader user={user} />
      </div>
      <div className="flex-1 flex pt-10">
        <OwnerSubscription user={user}/>
      </div>
    </div>

  );
};

export default OwnerSubPage;

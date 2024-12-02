'use client';

import React from 'react';


import OwnerHeader from '@/components/OwnerHeader';
import CBOBuildingData from '@/components/pages/CBOBuildingData'
import MemberStartQuotePage from '@/components/pages/MemberStartQuotePage'

import { useUser } from '@/components/UserContext';




const StartQuotePage: React.FC = () => {
  const { attributes } = useUser();
  const currentUser = attributes


  return (

    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pt-10">
        <OwnerHeader user={currentUser} />
      </div>
      <div className="flex-1 flex pt-10">
        <MemberStartQuotePage user={currentUser} />
      </div>
    </div>

  );
};

export default StartQuotePage;

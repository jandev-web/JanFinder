'use client';

import React from 'react';


import OwnerHeader from '@/components/OwnerHeader';
import CBOBuildingData from '@/components/pages/CBOBuildingData'


import { useUser } from '@/components/UserContext';




const AllQuotesPage: React.FC = () => {
  const { attributes } = useUser();
  const currentUser = attributes


  return (

    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pt-10">
        <OwnerHeader user={currentUser} />
      </div>
      <div className="flex-1 flex pt-10">
        <CBOBuildingData user={currentUser} />
      </div>
    </div>

  );
};

export default AllQuotesPage;

'use client';

import React, { useEffect, useState } from 'react';
import CreateCBOForm from '@/components/pages/AddCBO';
import OwnerHeader from '@/components/OwnerHeader';
import { useUser } from '@/components/UserContext';




const CBOListPage = () => {
  const { attributes } = useUser();
  const user = attributes

  return (
    <div className="flex w-full flex-col min-h-screen">
      {/* Header */}
      
        <OwnerHeader user={user} />
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full justify-center items-start pt-14">
        <CreateCBOForm user={user}/>
      </div>
    </div>
  );
};


export default CBOListPage;

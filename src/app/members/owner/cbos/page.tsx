'use client';

import React from 'react';
import AllCBOs from '@/components/pages/AllCBOs';
import OwnerHeader from '@/components/OwnerHeader';

import { useUser } from '@/components/UserContext';


const CBOListPage: React.FC = () => {

  const { attributes } = useUser();
  const currentUser = attributes

  console.log('CurrentUser1: ', currentUser)
  return (


    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pt-10">
        <OwnerHeader user={currentUser} />
      </div>
      <div className="flex-1 flex pt-10">
        <AllCBOs user={currentUser} />
      </div>
    </div>


  );
};


export default CBOListPage;

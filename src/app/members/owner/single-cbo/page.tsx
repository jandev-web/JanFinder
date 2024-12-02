'use client';

import React, { useEffect, useState } from 'react';
import SingleCBOPage from '@/components/pages/singleCBOPage';
import OwnerHeader from '@/components/OwnerHeader';
import { useUser } from '@/components/UserContext';




const CBOPage = () => {
  const { attributes } = useUser();
  const user = attributes
  
  
  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen">
            <OwnerHeader user={user} />
            <SingleCBOPage user={user}/>
          </div>
      
    
  );
};


export default CBOPage;

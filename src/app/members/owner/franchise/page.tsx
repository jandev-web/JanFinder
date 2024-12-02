'use client';

import React, { useState, useEffect } from 'react';
import OwnerHeader from '@/components/OwnerHeader';
import { useUser } from '@/components/UserContext';
import getFranchiseInfo from '@/utils/getFranchiseInfo';
import fetchOwnerById from '@/utils/getOwnerById';

import FranchisePage from '@/components/pages/FranchisePage'

const OwnerFranchisePage: React.FC = () => {
  const { attributes } = useUser();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <OwnerHeader user={attributes} />
      <div className='pt-14'>
        <FranchisePage user={attributes} />
      </div>
      
    </div>
  );
};

export default OwnerFranchisePage;

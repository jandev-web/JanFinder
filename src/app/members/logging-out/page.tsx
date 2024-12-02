'use client';

import React from 'react';
import LoggingOut from '@/components/pages/LoggingOut';

import { useUser } from '@/components/UserContext';


const FranchiseListPage: React.FC = () => {

  const { attributes } = useUser();
  const currentUser = attributes

  console.log('CurrentUser1: ', currentUser)
  return (


    <div>
      <LoggingOut user={currentUser}  />
      
    </div>


  );
};


export default FranchiseListPage;

'use client';

import React from 'react';
import { useUser } from '@/components/UserContext';
import SubscriptionPage from '@/components/pages/Subscribe';

import OwnerHeader from '@/components/OwnerHeader';


const OwnerSubscribePage: React.FC = () => {
  const { attributes } = useUser();
  const currentUser = attributes
  

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="w-full pb-12">
        <OwnerHeader user={currentUser} />
      </div>

      {/* Main Content */}
      <div className="w-full flex flex-col items-center mt-10">
        
          <SubscriptionPage user={currentUser} />
        
      </div>
    </div>
  );
};

export default OwnerSubscribePage;

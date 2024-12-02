'use client';

import React from 'react';
import { useUser } from '@/components/UserContext'; // Import the useUser hook
import '@aws-amplify/ui-react/styles.css'; // Ensure the styles are imported

import AvailableQuotes from '@/components/pages/AvailableQuotes';
import CBOHeader from '@/components/CBOHeader';




const AvailableQuotesPage: React.FC = () => {
  const { attributes } = useUser();
  const user = attributes
  return (

    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pt-10">
        <CBOHeader user={user} />
      </div>
      <div className="flex-1 flex pt-10">
        <AvailableQuotes user={user} />
      </div>
    </div>

  );
};

export default AvailableQuotesPage;

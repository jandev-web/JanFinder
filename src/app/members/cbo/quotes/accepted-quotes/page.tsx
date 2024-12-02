'use client';

import React from 'react';
import '@aws-amplify/ui-react/styles.css'; // Ensure the styles are imported
import { useUser } from '@/components/UserContext'; // Import the useUser hook
import CBOHeader from '@/components/CBOHeader';

import { AcceptedQuotes } from '@/components';



const AcceptedQuotesPage: React.FC = () => {
  const { attributes } = useUser();
  const user = attributes
  return (

    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pt-10">
        <CBOHeader user={user} />
      </div>
      <div className="flex-1 flex pt-10">
        <AcceptedQuotes user={user} />
      </div>
    </div >

  );
};

export default AcceptedQuotesPage;

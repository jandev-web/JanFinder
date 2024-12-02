'use client';

import React, { useEffect, useState } from 'react';
import CBOHeader from '@/components/CBOHeader';
import MemberStartQuotePage from '@/components/pages/MemberStartQuotePage';
import { useUser } from '@/components/UserContext';
import LoadingSpinner from '@/components/loadingScreen'; // Assume this is a loading spinner component

const StartQuotePage: React.FC = () => {
  const { attributes } = useUser();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (attributes) {
      setCurrentUser(attributes); // Set currentUser only when attributes are fully loaded
    }
  }, [attributes]);

  if (!currentUser) {
    // Render a loading spinner or loading message while waiting for user data to load
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner /> {/* Display a loading spinner while waiting */}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pt-10">
        <CBOHeader user={currentUser} />
      </div>
      <div className="flex-1 flex pt-10">
        <MemberStartQuotePage user={currentUser} />
      </div>
    </div>
  );
};

export default StartQuotePage;

'use client';

import React, { useEffect, useState } from 'react';


import OwnerHeader from '@/components/OwnerHeader';
import CBOBuildingData from '@/components/pages/CBOBuildingData'
import LoadingSpinner from '@/components/loadingScreen'; // Assume this is a loading spinner component
import CBOHeader from '@/components/CBOHeader'

import { useUser } from '@/components/UserContext';




const AllQuotesPage: React.FC = () => {
  const { attributes } = useUser();
  const [currentUser, setCurrentUser] = useState(null);
  const [owner, setOwner] = useState(null)
  useEffect(() => {
    if (attributes) {
      console.log(attributes)
      const ownerStatus = attributes?.['custom:isOwner'];
      setOwner(ownerStatus)
      console.log('Owner Status:', ownerStatus);

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
        {owner ? (<OwnerHeader user={currentUser} />) : (<CBOHeader user={currentUser} />)}
        
      </div>
      <div className="flex-1 flex pt-10">
        <CBOBuildingData user={currentUser} />
      </div>
    </div>

  );
};

export default AllQuotesPage;

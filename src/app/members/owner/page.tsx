'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/components/UserContext'; // Import the useUser hook
import { useRouter } from 'next/navigation';
import '@aws-amplify/ui-react/styles.css'; // Ensure the styles are imported
import Owner from '@/components/pages/Owner';
import LoginError from '@/components/LoginErrorComponent'



import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports';

Amplify.configure(awsExports);


const OwnerLanding: React.FC = () => {
  const { attributes } = useUser(); // Access the user from the context
  const [isLoading, setIsLoading] = useState(false);
  

  //console.log('Userrrrr: ', attributes)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (attributes) {
          // Perform any user-specific logic if needed
        //console.log('User in /CBO/owner:', attributes);
        setIsLoading(false);
        }
        else {
          return (
            <LoginError />
          )
          
          
        }
        
      } catch (error) {
        console.error('Error fetching current user:', error);
        
      }
    };

    fetchUser();
  }, []);
  if (isLoading) {
    return <div>Loa..ding...</div>; // Optionally display a loading state
  }
  return (
    <div>
     
        <Owner user={attributes} />
      
    </div>
  );
};

export default OwnerLanding;

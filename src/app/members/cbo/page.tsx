'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/components/UserContext'; // Import the useUser hook
import { useRouter } from 'next/navigation';
import '@aws-amplify/ui-react/styles.css'; // Ensure the styles are imported
import CBO from '@/components/pages/CBO';



import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports';

Amplify.configure(awsExports);


const CBOLanding: React.FC = () => {
  const { attributes } = useUser(); // Access the user from the context
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  console.log('Cbooo: ', attributes)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (attributes) {
          // Perform any user-specific logic if needed
        console.log('User in /member/cbo:', attributes);
        setIsLoading(false);
        }
        else {
          console.error('No user')
          //router.push('/members')
          
          
        }
        
      } catch (error) {
        console.error('Error fetching current user:', error);
        
      }
    };

    fetchUser();
  }, []);
  if (isLoading) {
    return <div>Loading...</div>; // Optionally display a loading state
  }
  return (
    <div>
     
        <CBO user={attributes} />
      
    </div>
  );
};

export default CBOLanding;

'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/components/UserContext'; // Import the useUser hook
import { useRouter } from 'next/navigation';
import '@aws-amplify/ui-react/styles.css'; // Ensure the styles are imported
import OwnerPageComponent from '@/components/pages/Owner';


import { signOut } from 'aws-amplify/auth';

import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports';

Amplify.configure(awsExports);


const OwnerPage: React.FC = () => {
  const { attributes } = useUser(); // Access the user from the context
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
          console.error('No user')
          router.push('/CBO');
        }
        
      } catch (error) {
        console.error('Error fetching current user:', error);
        router.push('/CBO');
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
     
        <OwnerPageComponent user={attributes} />
      
    </div>
  );
};

export default OwnerPage;

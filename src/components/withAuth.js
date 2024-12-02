// src/components/withAuth.js
import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports';
import { useRouter } from 'next/router';
import { Authenticator } from '@aws-amplify/ui-react';
import { Auth } from '@aws-amplify/auth';



const withAuth = (WrappedComponent) => {
  const WithAuthComponent = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      Auth.currentAuthenticatedUser()
        .then(() => {
          setIsAuthenticated(true);
        })
        .catch(() => {
          router.push('/login'); // Redirect to login page if not authenticated
        });
    }, [router]);

    if (!isAuthenticated) {
      return <div>Loading...</div>; // Or a loading spinner
    }

    return (
      <Authenticator>
        {({ signOut, user }) => (
          <WrappedComponent {...props} user={user} signOut={signOut} />
        )}
      </Authenticator>
    );
  };

  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
};

export default withAuth;

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useUser } from '@/components/UserContext';
import { checkIsOwner } from '@/utils/checkIsOwner';
import MemberLoadingScreen from '@/components/pages/MemberPageLoading';

interface LoginPageProps {
  user: any;
  signOut: () => void;
  isSigningOut: boolean;
  isRedirect: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ user, signOut, isSigningOut, isRedirect }) => {
  const { setAttributes } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isSigningOut) {
      console.log('Handling user sign out')
      sessionStorage.removeItem('attributes');
      signOut();
      
      router.push(isRedirect ? '/members/signIn' : '/members');
      return;
    }

    const handleUserCheck = async () => {
      if (user) {
        const attributes = await fetchUserAttributes();
        setAttributes(attributes);

        const isOwner = await checkIsOwner(attributes);
        router.push(isOwner ? '/members/owner' : '/members/cbo');
      } else {
        setIsLoading(false);
      }
    };

    handleUserCheck();
  }, [isSigningOut, user, router, isRedirect, setAttributes]);

  if (isLoading) {
    return <MemberLoadingScreen />;
  }

  return <div>Redirecting {user ? user.username : '...'}</div>;
};

export default LoginPage;
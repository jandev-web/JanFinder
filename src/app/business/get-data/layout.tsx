import { Suspense, ReactNode } from 'react';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { sessionStorage } from 'aws-amplify/utils';

//cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage);

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Suspense>
      {children}
    </Suspense>
  );
}

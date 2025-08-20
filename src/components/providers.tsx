'use client';
import '@/amplify/init.client';                 // <— this runs Amplify.configure on the client
import { Authenticator } from '@aws-amplify/ui-react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
}

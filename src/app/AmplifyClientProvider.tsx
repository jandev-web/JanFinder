'use client';
import { useEffect } from 'react';
import { initAmplifyClient } from '@/amplify/init.client';

export default function AmplifyClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAmplifyClient();
  }, []);
  return <>{children}</>;
}

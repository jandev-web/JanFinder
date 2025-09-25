import 'server-only';
import React from 'react';
import { Suspense, ReactNode } from 'react';
import { requireOwnerSetup } from '@/utils/requireOwnerSetup';

export const dynamic = 'force-dynamic';

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  await requireOwnerSetup();
  return (
    <Suspense>
      {children}
    </Suspense>
  );
}

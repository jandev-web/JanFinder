//src/app/business/owner/layout.tsx
import { Suspense, ReactNode } from 'react';


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


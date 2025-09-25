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

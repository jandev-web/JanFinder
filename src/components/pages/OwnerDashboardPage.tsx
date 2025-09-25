// src/components/pages/OwnerDashboard.tsx
'use client';

import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SimpleHeader } from '@/components/navigation/SimpleHeader';
import OwnerDashboard from '@/components/OwnerDashboard';
import OwnerSidebar from '@/components/navigation/OwnerSidebar';
export default function OwnerDashboardPage() {
  


   
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <OwnerSidebar
          currentView={'dashboard'}
        />
        <SidebarInset className="flex flex-col">
          <SimpleHeader title={'Business Dashboard'} subtitle={'Overview of your cleaning business operations'} />
          <div className="flex-1 bg-gray-50">
            <OwnerDashboard />;
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}


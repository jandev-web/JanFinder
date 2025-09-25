// src/components/pages/Owner/index.tsx (your prior "OwnerPage")
// This is a CLIENT component that receives ownerData from the server.
'use client';

import React, { useState } from 'react';
import { OwnerDashboard } from '@/components/Dashboard';
import { FranchiseMembers } from '@/components/FranchiseMembers';
import { BiddingPlatform } from '@/components/BiddingPlatform';
import { CRM } from '@/components/CRM';
import { FranchiseInfo } from '@/components/FranchiseInfo';
import { UserProfilePage } from '@/components/UserProfilePage';
import { UserSettingsPage } from '@/components/UserSettingsPage';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { SimpleHeader } from '@/components/navigation/SimpleHeader';
import { Customers } from '@/components/Customers';

export default function Business() {

  const [currentView, setCurrentView] = useState<'dashboard' | 'bidding' | 'customers' | 'members' | 'crm' | 'franchise-info' | 'profile' | 'settings'>('dashboard');


  const handleLogout = () => {

    setCurrentView('dashboard');
  };

  const handleSwitchView = (view: string) => {
    if (view === 'bidding') {
      setCurrentView('bidding');
    } else if (view === 'dashboard') {
      setCurrentView('dashboard');
    } else if (view === 'members') {
      setCurrentView('members');
    } else if (view === 'crm') {
      setCurrentView('crm');
    } else if (view === 'franchise-info') {
      setCurrentView('franchise-info');
    } else if (view === 'profile') {
      setCurrentView('profile');
    } else if (view === 'settings') {
      setCurrentView('settings');
    } else if (view === 'customers') {
      setCurrentView('customers');
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };



  // Bidding platform (full screen view)
  if (currentView === 'bidding') {
    return (
      <BiddingPlatform
        userType={'owner'}
        onBack={handleBackToDashboard}
        onLogout={handleLogout}
      />
    );
  }

  // Helper function to get page title
  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Business Dashboard';
      case 'members':
        return 'Franchise Members';
      case 'customers':
        return 'Customer Orders';
      case 'crm':
        return 'Customer Management';
      case 'franchise-info':
        return 'Franchise Information';
      case 'profile':
        return 'My Profile';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  // Helper function to get page subtitle
  const getPageSubtitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Overview of your cleaning business operations';
      case 'members':
        return 'Manage your franchise team members';
      case 'customers':
        return 'Manage quotes and contracts for your customers';
      case 'crm':
        return 'Manage customer relationships and interactions';
      case 'franchise-info':
        return 'View and manage franchise details';
      case 'profile':
        return 'Manage your personal information';
      case 'settings':
        return 'Account preferences and security';
      default:
        return '';
    }
  };

  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <OwnerDashboard onSwitchView={handleSwitchView} onLogout={handleLogout} />
      case 'members':
        return <FranchiseMembers onSwitchView={handleSwitchView} onLogout={handleLogout} />;
      case 'customers':
        return <Customers onSwitchView={handleSwitchView} onLogout={handleLogout} />;
      case 'crm':
        return <CRM onSwitchView={handleSwitchView} onLogout={handleLogout} />;
      case 'franchise-info':
        return (
          <FranchiseInfo
            userType={'owner'}
            onSwitchView={handleSwitchView}
            onLogout={handleLogout}
          />
        );
      case 'profile':
        return (
          <UserProfilePage
            userType={'owner'}
            onSwitchView={handleSwitchView}
            onLogout={handleLogout}
          />
        );
      case 'settings':
        return (
          <UserSettingsPage
            userType={'owner'}
            onSwitchView={handleSwitchView}
            onLogout={handleLogout}
          />
        );
      default:
        return <OwnerDashboard onSwitchView={handleSwitchView} onLogout={handleLogout} />
    }
  };

  // Main layout with sidebar
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          userType={'owner'}
          currentView={currentView}
          onNavigate={handleSwitchView}
          onLogout={handleLogout}
        />
        <SidebarInset className="flex flex-col">
          <SimpleHeader
            title={getPageTitle()}
            subtitle={getPageSubtitle()}
          />
          <div className="flex-1 bg-gray-50">
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
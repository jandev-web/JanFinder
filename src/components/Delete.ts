// src/app/business/owner/page.tsx
import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import Owner from '@/components/pages/OwnerDashboardPage';
import LoginError from '@/components/LoginErrorComponent';
import { createServerDataClient } from '@/utils/data-server';
import deleteFranchise from '@/utils/deleteFranchise';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;

export const dynamic = 'force-dynamic';

export default async function OwnerLanding() {
  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
  });

  if (!authUser) {
    redirect('/business/sign-in');
  }

  const client = createServerDataClient(cookies);

  // --- OWNER ---
  const ownerRes = await client.queries.getOwnerById(
    { id: authUser.userId },
    { authMode: 'userPool' }
  );
  if (ownerRes.errors?.length) redirect('/error');
  const ownerData = typeof ownerRes.data === 'string' ? JSON.parse(ownerRes.data) : ownerRes.data;

  const userID: string | undefined =
    ownerData?.data?.OwnerID ?? ownerData?.OwnerID ?? ownerData?.id ?? authUser.userId;

  const franchiseID: string | undefined =
    ownerData?.data?.FranchiseID ?? ownerData?.franchiseId ?? ownerData?.franchiseID;

  if (!userID || !franchiseID) redirect('/error');

  // --- MEMBERS (CBOs) ---
  const membersRes = await client.queries.ownerGetAllMembers(
    { ownerID: userID },
    { authMode: 'userPool' }
  );
  if (membersRes.errors?.length) redirect('/error');
  const membersPayload =
    typeof membersRes.data === 'string' ? JSON.parse(membersRes.data) : membersRes.data;
  const memberData = membersPayload?.members ?? membersPayload?.items ?? [];

  // --- FRANCHISE ---
  const franchiseRes = await client.queries.getFranchiseInfo(
    { franchiseID },
    { authMode: 'userPool' }
  );
  if (franchiseRes.errors?.length) redirect('/error');
  const franchiseData =
    typeof franchiseRes.data === 'string' ? JSON.parse(franchiseRes.data) : franchiseRes.data;

  // --- AVAILABLE QUOTES (owner) ---
  // getAvailableQuotesOwner takes NO args in your schema; pass {} + options
  const availableRes = await client.queries.getAvailableQuotesOwner(
    { authMode: 'userPool' }
  );
  if (availableRes.errors?.length) redirect('/error');
  const availablePayload =
    typeof availableRes.data === 'string' ? JSON.parse(availableRes.data) : availableRes.data;
  const availableQuotes = Array.isArray(availablePayload) ? availablePayload : [];

  // --- ACCEPTED QUOTES (owner + franchise split) ---
  const acceptedRes = await client.queries.getAcceptedQuotesOwner(
    { franchiseID, ownerID: userID },
    { authMode: 'userPool' }
  );
  if (acceptedRes.errors?.length) redirect('/error');
  const acceptedPayload =
    typeof acceptedRes.data === 'string' ? JSON.parse(acceptedRes.data) : acceptedRes.data;
  const ownerQuotes = Array.isArray(acceptedPayload?.ownerQuotes) ? acceptedPayload.ownerQuotes : [];
  const franchiseQuotes = Array.isArray(acceptedPayload?.franchiseQuotes) ? acceptedPayload.franchiseQuotes : [];

  // --- CRM / CUSTOMERS (split by owner vs other franchise users) ---
  const crmRes = await client.queries.getCustomersByFranchise(
    { ownerID: userID, franchiseID },
    { authMode: 'userPool' }
  );
  if (crmRes.errors?.length) redirect('/error');
  const crmPayload =
    typeof crmRes.data === 'string' ? JSON.parse(crmRes.data) : crmRes.data;
  const crmOwnerData = Array.isArray(crmPayload?.ownerCustomers) ? crmPayload.ownerCustomers : [];
  const crmFranchiseData = Array.isArray(crmPayload?.franchiseCustomers) ? crmPayload.franchiseCustomers : [];
  const crmData = { ownerCustomers: crmOwnerData, franchiseCustomers: crmFranchiseData };

  // --- SERVER ACTIONS ---
  async function setFranchiseTemplateAction(franchiseID: string, templateType: string, isThere: boolean) {
    'use server';
    const { data, errors } = await client.mutations.setFranchiseTemplate(
      { franchiseID, templateType, isThere },
      { authMode: 'userPool' }
    );
    if (errors?.length) {
      throw new Error(errors[0].message ?? 'setFranchiseTemplate failed');
    }
    return data ?? { message: 'OK' };
  }

  async function inviteMember(franchiseID: string, formData: FormData): Promise<any> {
    'use server';
    const email = (formData.get('email') ?? '').toString().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) {
      return { ok: false, error: 'Please enter a valid email.' };
    }
    const { errors } = await client.mutations.ownerInviteCBO(
      { franchiseID, email },
      { authMode: 'userPool' }
    );
    if (errors?.length) return { ok: false, error: errors[0].message ?? 'Failed to send invite.' };
    return { ok: true, error: null };
  }

  async function deleteCBO(cboID: string) {
    'use server';
    const res = await client.mutations.deleteCBO(
      { cboID },
      { authMode: 'userPool' }
    );
    if (res.errors?.length) {
      throw new Error(res.errors[0].message ?? 'deleteCBO failed');
    }
    return res.data ?? { message: 'OK' };
  }

  async function deleteFranchiseAction(ownerID: string) {
    'use server';
    await deleteFranchise(ownerID);
    redirect('/business/logging-out');
  }

  if (!ownerData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }

  return (
    <Owner
      ownerData={ownerData}
      franchiseData={franchiseData}
      memberData={memberData}
      // quotes
      availableQuotes={availableQuotes}
      ownerQuotes={ownerQuotes}
      franchiseQuotes={franchiseQuotes}
      // CRM
      crmData={crmData}
      // actions
      inviteMember={inviteMember}
      deleteMember={deleteCBO}                // passes the CBO delete action under your existing prop name
      deleteFranchise={deleteFranchiseAction}
      setFranchiseTemplateAction={setFranchiseTemplateAction}
    />
  );
}
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

type OwnerProps = {
  ownerData: any;
  franchiseData: any;
  memberData: any[];
  availableQuotes: any[];
  ownerQuotes: any[];
  franchiseQuotes: any[];
  crmData: { ownerCustomers: any[]; franchiseCustomers: any[] };

  inviteMember: (franchiseID: string, formData: FormData) => Promise<any>;
  deleteMember: (cboID: string) => Promise<any>;
  deleteFranchise: (ownerID: string) => Promise<void>;
  setFranchiseTemplateAction: (franchiseID: string, templateType: string, isThere: boolean) => Promise<any>;
};

export default function Business(props: OwnerProps) {
  // Destructure to "import" the server data/functions without using them.
  const {
    ownerData,
    franchiseData,
    memberData,
    availableQuotes,
    ownerQuotes,
    franchiseQuotes,
    crmData,
    inviteMember,
    deleteMember,
    deleteFranchise,
    setFranchiseTemplateAction,
  } = props;

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

// app/business/owner/available-quotes/page.tsx
import 'server-only';
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';

import { getOwnerByIdServer } from '@/utils/getOwnerByIdServer';
import { getAvailableQuotesServer } from '@/utils/getAvailableOwnerQuotesServer';
import { getFranchiseServer } from '@/utils/getFranchiseServer';

import OwnerAvaQuotesPage from '@/components/pages/OwnerAvailableQuotesPage';
import LoginError from '@/components/LoginErrorComponent';

type AmplifyUser = Awaited<ReturnType<typeof getCurrentUser>>;

export const dynamic = 'force-dynamic';

export default async function AvaQuotesPage() {
  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) => getCurrentUser(ctx).catch(() => null as AmplifyUser | null),
  });

  if (!authUser) {
    redirect('/business/sign-in');
  }

  const ownerData = await getOwnerByIdServer(authUser.userId);

  if (!ownerData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginError />
      </div>
    );
  }

  const franchiseId = (ownerData.franchiseId) as string | undefined;

  const [quotes, franchise] = await Promise.all([
    authUser.userId ? getAvailableQuotesServer(authUser.userId) : Promise.resolve([]),
    franchiseId ? getFranchiseServer(franchiseId) : Promise.resolve(null),
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <OwnerAvaQuotesPage
        ownerData={ownerData}
        quotes={quotes}
        franchise={franchise}
      />
    </div>
  );
}


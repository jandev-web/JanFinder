// src/app/business/owner/page.tsx
import 'server-only';
import React from 'react';
import OwnerDashboard from '@/components/pages/OwnerDashboardPage';
import { createServerDataClient } from '@/utils/data-server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const client = createServerDataClient(cookies);
  // fetch only what dashboard needs
  //const available = await client.queries.getAvailableQuotesOwner({}, { authMode: 'userPool' });
  // ...parse as you do now
  return <OwnerDashboard />;
}

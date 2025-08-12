'use client';

import React, { useEffect, useState } from 'react';

import { fetchUserAttributes } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';

import { useRouter } from 'next/navigation'; // Use useRouter from next/navigation
import MemberLoadingScreen from '@/components/pages/MemberPageLoading';

import createOwner from '@/utils/createOwner';
import getOwnerById from '@/utils/getOwnerById';

import createCBO from '@/utils/createCBO';
import fetchCBOById from '@/utils/getCBOByID';

interface RoleRouterProps {
  user: any;
}



const RoleRouter: React.FC<RoleRouterProps> = () => {
  const router = useRouter();
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const session = await fetchAuthSession();
        const p = session.tokens?.idToken?.payload ?? {};

        const sub = p.sub as string | undefined;
        const email = (p['email'] as string) || '';
        const given = (p['given_name'] as string) || '';
        const family = (p['family_name'] as string) || '';
        const phone = (p['phone_number'] as string) || '';
        const groups: string[] = (p['cognito:groups'] as string[]) || [];

        if (!sub) {
          router.push('/members/home');
          return;
        }

        const isOwner = groups.includes('Owner');
        const isMember = groups.includes('Member');

        // ---- OWNER FLOW ----
        if (isOwner) {
          let owner: any | null = null;

          // Try to fetch existing owner record
          try {
            owner = await getOwnerById(sub);
          } catch (e: any) {
            const msg = String(e?.message || '');
            if (!/404|Not\s*Found/i.test(msg)) throw e; // only ignore 404
          }

          // If none, create it now with firstSignIn=false
          if (!owner) {
            await createOwner({
              firstName: given,
              lastName: family,
              userID: sub,
              phone,
              address: { street: '', city: '', state: '', postalCode: '', country: '' },
              firstSignIn: false,
            });
            owner = { firstSignIn: false };
          }

          // Route based on firstSignIn flag
          if (owner?.firstSignIn === false) {
            router.push('/owner/create-franchise'); // onboarding page
          } else {
            router.push('/members/owner'); // owner dashboard
          }
          return;
        }

        // ---- MEMBER FLOW ----
        if (isMember) {

          let member: any | null = null;
          try {
            member = await fetchCBOById(sub);
          } catch (e: any) {
            const msg = String(e?.message || '');
            if (!/404|Not\s*Found/i.test(msg)) throw e;
          }
          if (!member) {
            await createCBO({
              firstName: given,
              lastName: family,
              phone,
            });
          }
          router.push('/members/cbo');
          return;
        }

        // Fallback if no recognized group
        router.push('/members/home');
      } catch (err) {
        // On error, don't strand the user
        router.push('/members/home');
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (busy) return <MemberLoadingScreen />;
  return null;
};

export default RoleRouter;
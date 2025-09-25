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
        const session = await fetchAuthSession({ forceRefresh: true });
        const groups = (session.tokens?.idToken?.payload?.['cognito:groups'] as string[]) || [];
        const p = session.tokens?.idToken?.payload ?? {};

        const sub = p.sub as string | undefined;
        const email = (p['email'] as string) || '';
        const given = (p['given_name'] as string) || '';
        const family = (p['family_name'] as string) || '';
        const phone = (p['phone_number'] as string) || '';

        console.log(sub)
        console.log(groups)

        if (!sub) {
          console.log('No sub found')
          //router.push('/business/home');
          return;
        }

        const isOwner = groups.includes('Owner');
        const isMember = groups.includes('Member');

        // ---- OWNER FLOW ----
        if (isOwner) {

          router.push('/business/owner'); // owner dashboard

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
            console.log('No member found, creating one...')
            await createCBO({
              firstName: given,
              lastName: family,
              phone,
            });
          }
          router.push('/business/cbo');
          return;
        }

        // Fallback if no recognized group
        console.log('No recognized group found');
        //router.push('/business/home');
      } catch (err) {
        // On error, don't strand the user
        //router.push('/business/home');
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
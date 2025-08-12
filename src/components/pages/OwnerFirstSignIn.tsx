'use client';

import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import createOwner from '@/utils/createOwner';
import fetchOwnerById from '@/utils/getOwnerById'; // adjust import name if different

type Props = {
  onDone?: () => void;      // called when bootstrap is finished (success or already exists)
  onError?: (err: any) => void;
};

export default function OwnerFirstLoginBootstrap({ onDone, onError }: Props) {
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const session = await fetchAuthSession();
        const payload = session.tokens?.idToken?.payload ?? {};
        const sub = payload.sub as string | undefined;
        if (!sub) throw new Error('Missing user sub');

        // 1) Check if Owner_DB row exists
        try {
          const existing = await fetchOwnerById(sub); // must return 404/undefined if not found
          if (existing) {
            if (!cancelled) setBusy(false);
            onDone?.();
            return;
          }
        } catch (e: any) {
          // If your util throws on 404, ignore; rethrow on other errors
          const msg = String(e?.message || '');
          if (!/404|Not\s*Found/i.test(msg)) {
            throw e;
          }
        }

        // 2) Create owner profile (server should read identity from JWT claims)
        const ownerPayload = {
          firstName: (payload.given_name as string) || '',
          lastName: (payload.family_name as string) || '',
          phone: (payload.phone_number as string) || '',
        };

        await createOwner(ownerPayload);

        if (!cancelled) setBusy(false);
        onDone?.();
      } catch (err) {
        if (!cancelled) setBusy(false);
        onError?.(err);
        // optional: console.error(err);
      }
    })();

    return () => { cancelled = true; };
  }, [onDone, onError]);

  // Keep this invisible; or render a tiny spinner if you prefer
  return busy ? null : null;
}

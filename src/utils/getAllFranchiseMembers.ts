// src/utils/getAllFranchiseMembers.ts
import 'server-only';
import { cookies } from 'next/headers';
import { createServerDataClient } from '@/utils/data-server';

// --- helpers ---
function normalizeOwner(raw: any) {
  const payload = typeof raw === 'string' ? JSON.parse(raw) : raw;

  // Accept { data: {...} } | { owner: {...} } | {...}
  const maybeOwner = payload?.owner ?? payload?.data ?? payload;
  if (!maybeOwner || typeof maybeOwner !== 'object') return null;

  const o = maybeOwner as Record<string, any>;
  return {
    id: o.OwnerID ?? o.id,
    franchiseId: o.FranchiseID ?? o.franchiseId,
    firstName: o.firstName ?? o.firstname,
    lastName: o.lastName ?? o.lastname,
    email: o.email,
    phone: o.phone,
    address:
      o.address ?? {
        country: o.country ?? '',
        state: o.state ?? '',
        city: o.city ?? '',
        street: o.street ?? '',
        postalCode: o.postalCode ?? '',
      },
    createdOn: o.createdOn,
    firstSignIn: o.firstSignIn,
    _raw: o,
  };
}

export async function getOwnerByIdServer(id: string) {
  if (!id) return null;

  const client = createServerDataClient(cookies);

  // Note: don't annotate to a stricter type; use the library's shape (errors can be undefined)
  const res = await client.queries.getOwnerById({ id }, { authMode: 'userPool' });

  // Coerce undefined/null → []
  const errs = Array.isArray(res.errors) ? res.errors : [];
  if (errs.length) {
    console.error('getOwnerByIdServer errors:', errs);
    return null;
  }

  const owner = normalizeOwner(res.data);

  if (!owner && process.env.NODE_ENV !== 'production') {
    console.warn('getOwnerByIdServer: unexpected owner shape', res.data);
  }

  return owner;
}

import 'server-only';
import { cookies } from 'next/headers';
import { createServerDataClient } from '@/utils/data-server';

function normalizeCbo(raw: any) {
  const payload = typeof raw === 'string' ? JSON.parse(raw) : raw;

  // Accept { cbo: {...} } | { data: {...} } | {...}
  const maybeCbo = payload?.cbo ?? payload?.data ?? payload;
  if (!maybeCbo || typeof maybeCbo !== 'object') return null;

  const c = maybeCbo as Record<string, any>;
  console.log(c)
  return {
    id: c.CBOID ?? c.id,
    franchiseId: c.FranchiseID ?? c.franchiseId,
    firstName: c.firstName ?? c.firstname,
    lastName: c.lastName ?? c.lastname,
    email: c.email,
    phone: c.phone,
    address:
      c.address ?? {
        country: c.country ?? '',
        state: c.state ?? '',
        city: c.city ?? '',
        street: c.street ?? '',
        postalCode: c.postalCode ?? '',
      },
    createdOn: c.createdOn,
    firstSignIn: c.firstSignIn,
    _raw: c,
  };
}

export async function getCboByIdServer(id: string) {
  if (!id) return null;

  const client = createServerDataClient(cookies);

  // Same error coercion pattern you use elsewhere
  const res = await client.queries.getCBOById({ id }, { authMode: 'userPool' });
  const errs = Array.isArray(res.errors) ? res.errors : [];
  if (errs.length) {
    console.error('getCboByIdServer errors:', errs);
    return null;
  }
  console.log(res.data)

  const cbo = normalizeCbo(res.data);
  if (!cbo && process.env.NODE_ENV !== 'production') {
    console.warn('getCboByIdServer: unexpected CBO shape', res.data);
  }
  return cbo;
}

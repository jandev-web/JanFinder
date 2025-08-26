'use client';

import { getDataClient } from './data-client';

export default async function fetchOwnerById(id: string) {
  if (!id) throw new Error('fetchOwnerById: "id" is required');

  const client = getDataClient(); 
  const res = await client.queries.getOwnerById({ id }, { authMode: 'userPool' });

  const errs = Array.isArray(res.errors) ? res.errors : [];
  if (errs.length) throw new Error(errs.map(e => e.message).join('; '));

  const payload = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;

  // If your resolver returns { owner }, { data }, or the raw record, normalize:
  const owner = payload?.owner ?? payload?.data ?? payload ?? null;

  // Return whichever shape your components expect:
  return owner;
  // If callers expect `{ data: ... }`, swap to:
  // return { data: owner };
}

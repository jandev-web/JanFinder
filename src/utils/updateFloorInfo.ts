// src/utils/updateFloorInfo.ts
'use client';

import { fetchAuthSession } from 'aws-amplify/auth';
import { getDataClient } from './data-client';

import type { Stairwells } from '@/types/quotes';

type FloorInfoInput = {
  floors: number;
  stairwells?: Partial<Stairwells>;
};

type UpdateResult = { message: string };

export default async function updateFloorInfo(
  quoteID: string | null,
  floorInfo: FloorInfoInput
): Promise<UpdateResult> {
  if (!quoteID) throw new Error('quoteID is required');

  // Coerce to numbers and stringify for AWSJSON
  const floors = Number(floorInfo?.floors ?? 0);
  const carpet = Number(floorInfo?.stairwells?.carpet ?? 0);
  const hardfloor = Number(floorInfo?.stairwells?.hardfloor ?? 0);

  const clean: { floors: number; stairwells: Stairwells } = {
    floors,
    stairwells: { carpet, hardfloor },
  };

  const s = await fetchAuthSession({ forceRefresh: true });
  const authMode = s.tokens ? 'userPool' : 'identityPool';

  // Send as AWSJSON (string)
  const { data, errors } = await getDataClient().queries.updateFloorInfo(
    { quoteID, floorInfo: JSON.stringify(clean) as unknown as any },
    { authMode }
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof payload.message !== 'string') {
    throw new Error('Unexpected response from updateFloorInfo');
  }
  return payload as UpdateResult;
}

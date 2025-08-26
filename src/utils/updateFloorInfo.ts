// src/utils/updateFloorInfo.ts
'use client';
import { getDataClient } from './data-client';

type FloorInfo = {
  floors: number;
  stairwells?: { carpet?: number; hardfloor?: number };
};

type UpdateResult = { message: string };

export default async function updateFloorInfo(
  quoteID: string | null,
  floorInfo: FloorInfo
): Promise<UpdateResult> {
  if (!quoteID) throw new Error('quoteID is required');

  // Coerce to numbers and stringify for AWSJSON
  const floors = Number(floorInfo?.floors ?? 0);
  const carpet = Number(floorInfo?.stairwells?.carpet ?? 0);
  const hardfloor = Number(floorInfo?.stairwells?.hardfloor ?? 0);

  const clean = { floors, stairwells: { carpet, hardfloor } };
  const json = JSON.stringify(clean); // <-- IMPORTANT for AWSJSON

  const { data, errors } = await getDataClient().queries.updateFloorInfo(
    { quoteID, floorInfo: json as any }, // send JSON string
    { authMode: 'identityPool' }
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof payload.message !== 'string') {
    throw new Error('Unexpected response from updateFloorInfo');
  }
  return payload as UpdateResult;
}

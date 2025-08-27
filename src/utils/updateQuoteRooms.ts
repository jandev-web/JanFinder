'use client';
import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';

type FloorTypes = { hardfloor?: number; carpet?: number };
type FormInfo = { roomTypes: any[]; sqft: number; floorTypes: FloorTypes };
type Result = { message: string };

export async function manualAddRoom(
  quoteID: string | null,
  formInfo: FormInfo
): Promise<Result> {
  if (!quoteID) throw new Error('quoteID is required');

  // Sanitize and stringify for AWSJSON
  const clean = JSON.parse(JSON.stringify(formInfo ?? {}));
  const json = JSON.stringify(clean); // IMPORTANT: a.json() → AWSJSON expects a string
  const s = await fetchAuthSession({ forceRefresh: true });
  const mode = s.tokens ? 'userPool' : 'identityPool';
  const { data, errors } = await getDataClient().queries.updateQuoteRooms(
    { quoteID, formInfo: json as any },
    { authMode: mode }
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof payload.message !== 'string') {
    throw new Error('Unexpected response from manualAddRoom');
  }
  return payload as Result;
}

export default manualAddRoom;

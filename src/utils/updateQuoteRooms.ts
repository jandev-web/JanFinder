'use client';
import { dataClient } from './data-client';

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

  const { data, errors } = await dataClient.queries.updateQuoteRooms(
    { quoteID, formInfo: json as any },
    { authMode: 'identityPool' }
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof payload.message !== 'string') {
    throw new Error('Unexpected response from manualAddRoom');
  }
  return payload as Result;
}

export default manualAddRoom;

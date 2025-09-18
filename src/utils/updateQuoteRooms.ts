// src/utils/manualAddRoom.ts
'use client';

import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';

import type {
  FloorTypePercentages,
  RoomTypeSelection,
} from '@/types/quotes';

type FormInfo = {
  roomTypes: RoomTypeSelection[];
  sqft: number;
  floorTypes: FloorTypePercentages;
};

type Result = { message: string };

export async function manualAddRoom(
  quoteID: string | null,
  formInfo: FormInfo
): Promise<Result> {
  if (!quoteID) throw new Error('quoteID is required');

  // Sanitize shapes & coerce numbers
  const cleanRoomTypes: RoomTypeSelection[] = Array.isArray(formInfo?.roomTypes)
    ? formInfo.roomTypes.map((r) => ({
        roomType: String((r as any)?.roomType ?? ''),
        count: Number((r as any)?.count ?? 0),
      }))
    : [];

  const sqft = Number(formInfo?.sqft ?? 0);
  const floorTypes: FloorTypePercentages = {
    hardfloor: Number(formInfo?.floorTypes?.hardfloor ?? 0),
    carpet: Number(formInfo?.floorTypes?.carpet ?? 0),
  };

  const clean: FormInfo = {
    roomTypes: cleanRoomTypes,
    sqft,
    floorTypes,
  };

  // Send as AWSJSON string
  const s = await fetchAuthSession({ forceRefresh: true });
  const authMode = s.tokens ? 'userPool' : 'identityPool';

  const { data, errors } = await getDataClient().queries.updateQuoteRooms(
    { quoteID, formInfo: JSON.stringify(clean) as unknown as any },
    { authMode }
  );

  if (errors?.length) throw new Error(errors.map((e) => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof payload.message !== 'string') {
    throw new Error('Unexpected response from manualAddRoom');
  }
  return payload as Result;
}

export default manualAddRoom;

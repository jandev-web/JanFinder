'use client';

import { dataClient } from './data-client';

type Result = { message: string };

export async function changeFacilityType(
  quoteID: string,
  facilityType: string
): Promise<Result> {
  if (!quoteID || !facilityType) {
    throw new Error('quoteID and facilityType are required');
  }

  const { data, errors } = await dataClient.queries.updateFacilityType(
    { quoteID, facilityType },
    { authMode: 'identityPool' } // IAM (guest or signed-in via Identity Pool)
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof payload.message !== 'string') {
    throw new Error('Unexpected response from changeFacilityType');
  }
  return payload as Result;
}

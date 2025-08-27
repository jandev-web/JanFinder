'use client';

import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';

type Result = { message: string };

export async function changeFacilityType(
  quoteID: string,
  facilityType: string
): Promise<Result> {
  if (!quoteID || !facilityType) {
    throw new Error('quoteID and facilityType are required');
  }
  const s = await fetchAuthSession({ forceRefresh: true });
  const mode = s.tokens ? 'userPool' : 'identityPool';

  const { data, errors } = await getDataClient().queries.updateFacilityType(
    { quoteID, facilityType },
    { authMode: mode } // IAM (guest or signed-in via Identity Pool)
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof payload.message !== 'string') {
    throw new Error('Unexpected response from changeFacilityType');
  }
  return payload as Result;
}

// src/utils/get-facility-options.ts
'use client';

import { dataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';

export type FacilityOptions = Record<string, string[]>;

export async function getFacilityOptions(): Promise<FacilityOptions> {
  await fetchAuthSession({ forceRefresh: true });

  const { data, errors } = await dataClient.queries.getFacilityOptions(
    { authMode: 'identityPool' } // guest-friendly
  );
  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  // If schema returns a.json(), `data` is an AWSJSON string; otherwise it may already be an object
  const parsed = typeof data === 'string' ? JSON.parse(data) : data;

  // Support both shapes: either top-level { facilityOptions } or the object itself
  const options: unknown = parsed?.facilityOptions ?? parsed;

  if (!options || typeof options !== 'object') {
    throw new Error('Malformed getFacilityOptions payload');
  }
  return options as FacilityOptions;
}

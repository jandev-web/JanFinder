// src/utils/updateCustomerInfo.ts
'use client';

import { fetchAuthSession } from 'aws-amplify/auth';
import { getDataClient } from './data-client';

import type { Address } from '@/types/address';
import type { Quote } from '@/types/quotes';

type CustomerInfoInput =
  Partial<Quote['customerData']> & {
    /** mirror of the top-level email on the Quote */
    email?: string;
  };

type UpdateResult = { message: string };

export async function updateCustomerInfo(
  quoteID: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  phone?: string,
  company?: string,
  address?: Partial<Address>
): Promise<UpdateResult> {
  const customerInfo: CustomerInfoInput = {
    firstName,
    lastName,
    email,
    phone,
    company,
    address,
  };

  // strip undefined so DDB marshaller can remove them server-side
  const clean = JSON.parse(JSON.stringify(customerInfo)) as CustomerInfoInput;

  const s = await fetchAuthSession({ forceRefresh: true });
  const authMode = s.tokens ? 'userPool' : 'identityPool';

  // Send as AWSJSON (string) to AppSync
  const { data, errors } = await getDataClient().queries.updateCustomerInfo(
    { quoteID, customerInfo: JSON.stringify(clean) as unknown as any },
    { authMode }
  );

  if (errors?.length) throw new Error(errors.map((e) => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof payload.message !== 'string') {
    throw new Error('Unexpected response from updateCustomerInfo');
  }
  return payload as UpdateResult;
}

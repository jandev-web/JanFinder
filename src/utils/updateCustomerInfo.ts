// src/utils/updateCustomerInfo.ts
'use client';

import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';

type Address = {
  street?: string; city?: string; state?: string; postalCode?: string; country?: string;
};
type CustomerInfo = {
  firstName?: string; lastName?: string; email?: string; phone?: string; company?: string; address?: Address;
};
type UpdateResult = { message: string };

export async function updateCustomerInfo(
  quoteID: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  phone?: string,
  company?: string,
  address?: Address
): Promise<UpdateResult> {
  const customerInfo: CustomerInfo = { firstName, lastName, email, phone, company, address };
  const clean = JSON.parse(JSON.stringify(customerInfo)); // remove undefined
  const s = await fetchAuthSession({ forceRefresh: true });
  const mode = s.tokens ? 'userPool' : 'identityPool';
  // ⬇️ send as JSON string for AWSJSON
  const { data, errors } = await getDataClient().queries.updateCustomerInfo(
    { quoteID, customerInfo: JSON.stringify(clean) as unknown as any },
    { authMode: mode }
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof payload.message !== 'string') {
    throw new Error('Unexpected response from updateCustomerInfo');
  }
  return payload as UpdateResult;
}

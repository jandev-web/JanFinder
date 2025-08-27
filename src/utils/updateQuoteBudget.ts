'use client';

import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';
type UpdateBudgetResult = { message: string };

export async function updateQuoteBudget(quoteID: string, budget: number): Promise<UpdateBudgetResult> {
  const numeric = Number(budget);
  if (!quoteID || !Number.isFinite(numeric)) {
    throw new Error('quoteID and a valid numeric budget are required');
  }
  const s = await fetchAuthSession({ forceRefresh: true });
  const mode = s.tokens ? 'userPool' : 'identityPool';

  const { data, errors } = await getDataClient().queries.updateQuoteBudget(
    { quoteID, budget: numeric },
    { authMode: mode } // IAM (guest/signed-in via Identity Pool)
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof payload.message !== 'string') {
    throw new Error('Unexpected response from updateQuoteBudget');
  }
  return payload as UpdateBudgetResult;
}

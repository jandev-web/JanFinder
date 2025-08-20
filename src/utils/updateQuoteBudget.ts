'use client';

import { dataClient } from './data-client';

type UpdateBudgetResult = { message: string };

export async function updateQuoteBudget(quoteID: string, budget: number): Promise<UpdateBudgetResult> {
  const numeric = Number(budget);
  if (!quoteID || !Number.isFinite(numeric)) {
    throw new Error('quoteID and a valid numeric budget are required');
  }

  const { data, errors } = await dataClient.queries.updateQuoteBudget(
    { quoteID, budget: numeric },
    { authMode: 'identityPool' } // IAM (guest/signed-in via Identity Pool)
  );

  if (errors?.length) throw new Error(errors.map(e => e.message).join('; '));

  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  if (!payload || typeof payload.message !== 'string') {
    throw new Error('Unexpected response from updateQuoteBudget');
  }
  return payload as UpdateBudgetResult;
}

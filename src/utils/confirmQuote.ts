'use client';
import { getDataClient } from './data-client';
import { fetchAuthSession } from 'aws-amplify/auth';

type ConfirmResult = {
  message: string;
  confirmationNumber: string;
};

type EmailResult = {
  message: string;
};

export default async function confirmQuote(quoteID: string): Promise<ConfirmResult> {
  if (!quoteID) throw new Error('quoteID is required');
  const s = await fetchAuthSession({ forceRefresh: true });
  const mode = s.tokens ? 'userPool' : 'identityPool';
  // 1) Confirm the quote (Amplify Data)
  const { data: confirmData, errors: confirmErrors } = await getDataClient().queries.confirmQuote(
    { quoteID },
    { authMode: mode }
  );
  if (confirmErrors?.length) throw new Error(confirmErrors.map(e => e.message).join('; '));

  const confirmed = typeof confirmData === 'string' ? JSON.parse(confirmData) : confirmData;
  if (!confirmed || typeof confirmed.message !== 'string' || typeof confirmed.confirmationNumber !== 'string') {
    throw new Error('Unexpected response from confirmQuote');
  }
  
  // 2) Send confirmation email (Amplify Data) — util triggers this, not the Lambda
  const { data: emailData, errors: emailErrors } = await getDataClient().queries.sendQuoteConfirmationEmail(
    { quoteID },
    { authMode: mode }
  );
  if (emailErrors?.length) throw new Error(emailErrors.map(e => e.message).join('; '));

  const emailRes: EmailResult = typeof emailData === 'string' ? JSON.parse(emailData) : emailData;
  if (!emailRes || typeof emailRes.message !== 'string') {
    throw new Error('Unexpected response from sendConfirmEmail');
  }

  // Return original confirm payload
  return confirmed as ConfirmResult;
}

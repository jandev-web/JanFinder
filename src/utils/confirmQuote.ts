'use client';
import { dataClient } from './data-client';

type ConfirmResult = {
  message: string;
  confirmationNumber: string;
};

type EmailResult = {
  message: string;
};

export default async function confirmQuote(quoteID: string): Promise<ConfirmResult> {
  if (!quoteID) throw new Error('quoteID is required');

  // 1) Confirm the quote (Amplify Data)
  const { data: confirmData, errors: confirmErrors } = await dataClient.queries.confirmQuote(
    { quoteID },
    { authMode: 'identityPool' }
  );
  if (confirmErrors?.length) throw new Error(confirmErrors.map(e => e.message).join('; '));

  const confirmed = typeof confirmData === 'string' ? JSON.parse(confirmData) : confirmData;
  if (!confirmed || typeof confirmed.message !== 'string' || typeof confirmed.confirmationNumber !== 'string') {
    throw new Error('Unexpected response from confirmQuote');
  }

  // 2) Send confirmation email (Amplify Data) — util triggers this, not the Lambda
  const { data: emailData, errors: emailErrors } = await dataClient.queries.sendQuoteConfirmationEmail(
    { quoteID },
    { authMode: 'identityPool' }
  );
  if (emailErrors?.length) throw new Error(emailErrors.map(e => e.message).join('; '));

  const emailRes: EmailResult = typeof emailData === 'string' ? JSON.parse(emailData) : emailData;
  if (!emailRes || typeof emailRes.message !== 'string') {
    throw new Error('Unexpected response from sendConfirmEmail');
  }

  // Return original confirm payload
  return confirmed as ConfirmResult;
}

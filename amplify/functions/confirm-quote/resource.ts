import { defineFunction } from '@aws-amplify/backend';

export const confirmQuoteFn = defineFunction({
  name: 'confirm-quote',
  entry: './handler.ts',
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
    // If you migrate the email sender into Amplify later, update this value in backend.ts
    CONFIRM_EMAIL_FUNCTION: 'SendCustomerConfirmationEmail',
  },
});

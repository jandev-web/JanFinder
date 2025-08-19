import { defineFunction } from '@aws-amplify/backend';

export const sendQuoteConfirmationEmailFn = defineFunction({
  name: 'send-quote-confirmation-email',
  entry: './handler.ts',
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
    SENDER_EMAIL: 'confirmation@bid2clean.com',          // change if needed
    SITE_URL: process.env.SITE_URL ?? 'https://bid2clean.com', // used in the button
  },
});

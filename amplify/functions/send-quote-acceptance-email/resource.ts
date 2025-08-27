import { defineFunction } from '@aws-amplify/backend';

export const sendQuoteAcceptanceEmailFn = defineFunction({
  name: 'send-quote-acceptance-email',
  entry: './handler.ts',
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
    FRANCHISE_TABLE: 'Franchise_DB',
    QUOTE_PDF_BUCKET_NAME: 'janfindbucket1c1b5-dev',
    FROM_EMAIL: 'noreply@bid2clean.com',
  },
});

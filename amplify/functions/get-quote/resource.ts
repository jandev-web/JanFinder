import { defineFunction } from '@aws-amplify/backend';

export const getQuoteFn = defineFunction({
  name: 'get-quote',
  entry: './handler.ts',
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
  },
});

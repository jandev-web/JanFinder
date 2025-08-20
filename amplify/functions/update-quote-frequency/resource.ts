import { defineFunction } from '@aws-amplify/backend';

export const updateQuoteFrequencyFn = defineFunction({
  name: 'update-quote-frequency',
  entry: './handler.ts',
  environment: {
    // keep in sync with your table name
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
  },
  resourceGroupName: 'data',
});

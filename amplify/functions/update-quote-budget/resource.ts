import { defineFunction } from '@aws-amplify/backend';

export const updateQuoteBudgetFn = defineFunction({
  name: 'update-quote-budget',
  entry: './handler.ts',
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
  },
});

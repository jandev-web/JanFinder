import { defineFunction } from '@aws-amplify/backend';

export const createCustomerQuoteFn = defineFunction({
  name: 'create-customer-quote',
  entry: './handler.ts',
  // Pass table name in env so you can change per-env if needed
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
  },
  resourceGroupName: 'data',
});

import { defineFunction } from '@aws-amplify/backend';

export const updateCustomerInfoFn = defineFunction({
  name: 'update-customer-info',
  entry: './handler.ts',
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
  },
});

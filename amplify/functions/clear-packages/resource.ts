// amplify/functions/clear-packages/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const clearPackagesFn = defineFunction({
  name: 'clear-packages',
  entry: './handler.ts',
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
  },
});

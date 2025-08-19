import { defineFunction } from '@aws-amplify/backend';

export const updatePackageChoiceFn = defineFunction({
  name: 'update-package-choice',
  entry: './handler.ts',
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
  },
});

import { defineFunction } from '@aws-amplify/backend';

export const updateFloorInfoFn = defineFunction({
  name: 'update-floor-info',
  entry: './handler.ts',
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
  },
});

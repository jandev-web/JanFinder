import { defineFunction } from '@aws-amplify/backend';

export const updateFacilityTypeFn = defineFunction({
  name: 'update-facility-type',
  entry: './handler.ts',
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
  },
});

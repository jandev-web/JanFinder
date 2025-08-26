import { defineFunction } from '@aws-amplify/backend';

export const getAvailableQuotesOwnerFn = defineFunction({
  name: 'get-quotes-owner-available',
  entry: './handler.ts',
  timeoutSeconds: 30,
  environment: {
    TABLE: 'Owner_DB',
    PK_NAME: 'isAvailable',
    INDEX: 'AvailableQuotesIndex'
  },
});

import { defineFunction } from '@aws-amplify/backend';

export const getFranchiseFn = defineFunction({
  name: 'get-franchise',
  entry: './handler.ts',
  timeoutSeconds: 30,
  environment: {
    OWNER_TABLE_NAME: 'Franchise_DB',
    OWNER_PK_NAME: 'FranchiseID',
  },
});

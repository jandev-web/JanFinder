import { defineFunction } from '@aws-amplify/backend';

export const updateFranchiseInfoFn = defineFunction({
  name: 'update-franchise-info',
  entry: './handler.ts',
  environment: {
    FRANCHISE_TABLE: 'Franchise_DB',
    OWNER_TABLE: 'Owner_DB',
  },
});

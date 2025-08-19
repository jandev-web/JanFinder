import { defineFunction } from '@aws-amplify/backend';

export const createOwnerFn = defineFunction({
  name: 'create-owner',
  entry: './handler.ts',
  resourceGroupName: 'http-api',        // 👈 co-locate with the API
  environment: {
    OWNER_TABLE: 'Owner_DB',
    FRANCHISE_TABLE: 'Franchise_DB',
  },
});

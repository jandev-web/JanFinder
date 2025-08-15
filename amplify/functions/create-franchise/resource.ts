import { defineFunction } from '@aws-amplify/backend';

export const createFranchiseFn = defineFunction({
  name: 'create-franchise',
  entry: './handler.ts',
  resourceGroupName: 'http-api',        // 👈 co-locate with the API
  timeoutSeconds: 15,
  memoryMB: 256,
  environment: {
    FRANCHISE_TABLE: 'Franchise_DB',
  },
});

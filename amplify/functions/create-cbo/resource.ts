import { defineFunction } from '@aws-amplify/backend';

export const createCboFn = defineFunction({
  name: 'create-cbo',
  entry: './handler.ts',
  resourceGroupName: 'http-api',        // 👈 co-locate with the API
  timeoutSeconds: 20,
  memoryMB: 256,
  environment: {
    CBO_TABLE_NAME: 'CBO_DB',
    OWNER_TABLE_NAME: 'Owner_DB',
    S3_BUCKET: 'cbo-pic-storage',
    // USER_POOL_ID is added dynamically in backend.ts as before
  },
});

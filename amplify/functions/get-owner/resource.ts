import { defineFunction } from '@aws-amplify/backend';

export const getOwnerFn = defineFunction({
  name: 'get-owner',
  entry: './handler.ts',
  timeoutSeconds: 30,
  environment: {
    OWNER_TABLE_NAME: 'Owner_DB',
    OWNER_PK_NAME: 'OwnerID',
  },
});

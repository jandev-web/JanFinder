import { defineFunction } from '@aws-amplify/backend';

export const postConfirmation = defineFunction({
  name: 'post-confirmation',
  entry: './handler.ts',
  resourceGroupName: 'auth',    // 👈 lives with auth resources
  environment: {
    OWNER_TABLE: 'Owner_DB',
    CBO_TABLE: 'CBO_DB',
    FRANCHISE_TABLE: 'Franchise_DB',
  },
});

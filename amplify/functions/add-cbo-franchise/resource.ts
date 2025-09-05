// amplify/functions/add-cbo-franchise/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const addCboFranchiseFn = defineFunction({
  name: 'add-cbo-franchise',
  entry: './handler.ts',
  environment: {
    CBO_TABLE: 'CBO_DB',
    MEMBERS_GROUP: 'Member',
  },
});

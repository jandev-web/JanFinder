import { defineFunction } from '@aws-amplify/backend';

export const ownerGetAllMembersFn = defineFunction({
  name: 'owner-get-all-members',
  entry: './handler.ts',
  environment: {
    OWNER_TABLE: 'Owner_DB',
    CBO_TABLE: 'CBO_DB',
  },
});

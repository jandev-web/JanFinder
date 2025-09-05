import { defineFunction } from '@aws-amplify/backend';

export const sendContractCreatedEmailFn = defineFunction({
  name: 'send-contract-created-email',
  entry: './handler.ts',
  resourceGroupName: 'data',
  environment: {
    FROM_EMAIL: 'no-reply@yourdomain.com', // adjust
  },
});

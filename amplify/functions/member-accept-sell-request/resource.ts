import { defineFunction } from '@aws-amplify/backend';

export const memberAcceptSellRequestFn = defineFunction({
  name: 'member-accept-sell-request',
  entry: './handler.ts',
  resourceGroupName: 'data',
  environment: {
    STATE_MACHINE_ARN: 'to-be-injected', // set in backend.ts
  },
});

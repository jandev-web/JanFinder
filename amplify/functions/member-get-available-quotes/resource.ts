import { defineFunction } from '@aws-amplify/backend';

export const memberGetAvailableQuotesFn = defineFunction({
  name: 'member-get-available-quotes',
  entry: './handler.ts',
  resourceGroupName: 'data', // keep this in 'data' to avoid circular deps
});

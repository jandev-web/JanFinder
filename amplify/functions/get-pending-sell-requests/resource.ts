import { defineFunction } from '@aws-amplify/backend';

export const getPendingSellRequestsFn = defineFunction({
  name: 'get-pending-sell-requests',
  entry: './handler.ts',
  environment: {
    SELL_REQUESTS_TABLE: 'SellRequest_DB',
    SELL_REQUESTS_GSI_OWNER: 'FromOwnerID-index',
  },
});

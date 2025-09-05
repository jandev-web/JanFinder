import { defineFunction } from '@aws-amplify/backend';

export const updateContractLinksFn = defineFunction({
  name: 'update-contract-links',
  entry: './handler.ts',
  resourceGroupName: 'data',
  environment: {
    SELL_REQUEST_TABLE: 'SellRequest_DB',
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
  },
});

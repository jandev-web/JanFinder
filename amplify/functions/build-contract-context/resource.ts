import { defineFunction } from '@aws-amplify/backend';

export const buildContractContextFn = defineFunction({
  name: 'build-contract-context',
  entry: './handler.ts',
  resourceGroupName: 'data',
  environment: {
    SELL_REQUEST_TABLE: 'SellRequest_DB',
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
    OWNER_TABLE: 'Owner_DB',
    CBO_TABLE: 'CBO_DB',
    FRANCHISE_TABLE: 'Franchise_DB',
    TEMPLATE_BUCKET: 'to-be-injected', // set in backend.ts
    OUTPUT_BUCKET: 'to-be-injected',   // set in backend.ts
  },
});

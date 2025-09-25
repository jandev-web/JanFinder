// amplify/functions/get-customers-by-franchise/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const getCustomersByFranchiseFn = defineFunction({
  name: 'get-customers-by-franchise',
  entry: './handler.ts',
  resourceGroupName: 'data',
  // default Node.js runtime from Gen2 is fine; no extra env needed
});

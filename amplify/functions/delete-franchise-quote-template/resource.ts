import { defineFunction } from '@aws-amplify/backend';

export const deleteFranchiseQuoteTemplateFn = defineFunction({
  name: 'delete-franchise-quote-template',
  entry: './handler.ts',
  runtime: 20,             // Node.js 20
  resourceGroupName: 'data',
  timeoutSeconds: 20,
  memoryMB: 512,
});

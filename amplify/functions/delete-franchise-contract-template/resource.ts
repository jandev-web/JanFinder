import { defineFunction } from '@aws-amplify/backend';

export const deleteFranchiseContractTemplateFn = defineFunction({
  name: 'delete-franchise-contract-template',
  entry: './handler.ts',
  runtime: 20,             // Node.js 20
  resourceGroupName: 'data',
  timeoutSeconds: 20,
  memoryMB: 512,
});

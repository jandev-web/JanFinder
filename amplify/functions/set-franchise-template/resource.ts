import { defineFunction } from '@aws-amplify/backend';

export const setFranchiseTemplateFn = defineFunction({
  name: 'set-franchise-template',
  // TS:
  entry: './handler.ts',
  // If you used the JS file instead, use: entry: './index.js'
  environment: {
    FRANCHISE_TABLE: 'Franchise_DB',
  },
  timeoutSeconds: 10,
  memoryMB: 256,
  runtime: 20, // Node.js 20.x
});

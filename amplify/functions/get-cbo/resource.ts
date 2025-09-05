import { defineFunction } from '@aws-amplify/backend';

export const getCboFn = defineFunction({
  name: 'get-cbo',
  entry: './handler.ts',
  // (optional) tweak as you like:
  timeoutSeconds: 10,
  memoryMB: 256,
  environment: {
    CBO_TABLE: 'CBO_DB',
  },
});

// amplify/functions/validate-contract-template-proxy/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const validateContractTemplateProxyFn = defineFunction({
  name: 'validate-contract-template-proxy',
  entry: './handler.ts',           // Node/TS entry only
  runtime: 20,                   // Node.js 20
  resourceGroupName: 'data',    
  timeoutSeconds: 29,   // ← increase from implicit 3s to ~30s
  memoryMB: 512,     
});


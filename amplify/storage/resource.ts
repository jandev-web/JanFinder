import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'JanFinderStorage',
  access: (allow) => ({
    'contracts/*': [
      allow.authenticated.to(['read', 'write'])
    ],
    'contract-templates/*': [
      allow.authenticated.to(['read', 'write'])
    ],
    'quote-templates/*': [
      allow.authenticated.to(['read', 'write'])
    ],
  })
});
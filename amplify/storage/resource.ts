import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'QuoteStorage',
  access: (allow) => ({
    'members/franchise/*': [
      allow.groups(['Member']).to(['read']),
      allow.groups(['Owner']).to(['read', 'write', 'delete'])
    ],
  })
});


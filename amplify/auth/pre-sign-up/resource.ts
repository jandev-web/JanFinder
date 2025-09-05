import { defineFunction } from '@aws-amplify/backend';

export const preSignUp = defineFunction({
  name: 'pre-sign-up',
  entry: './handler.ts', // this file lives next to resource.ts
  resourceGroupName: 'auth',
  environment: {
    INVITE_HMAC_SECRET: 'yYt0vJPv2sM0J8sQm3fF1jR9kG5dNq7uLx4A2wZ6bH8cE3pT1U9rV7oQ5M3nD1sB',
  },
});

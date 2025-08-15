import { defineFunction } from '@aws-amplify/backend';

export const preSignUp = defineFunction({
  name: 'pre-sign-up',
  entry: './handler.ts', // this file lives next to resource.ts
  resourceGroupName: 'auth',
});

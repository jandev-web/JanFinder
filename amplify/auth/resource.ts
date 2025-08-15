// amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend';
import { preSignUp } from "./pre-sign-up/resource";
import { postConfirmation } from "./post-sign-up-confirmation/resource";
export const auth = defineAuth({
  loginWith: { email: true },
  multifactor: {mode: 'OFF'},
  groups: ['Admin', 'Owner', 'Member'],
  triggers: {
    preSignUp,
    postConfirmation
  },
});

// amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend';
import { createAuthChallenge } from "./create-auth-challenge/resource"
import { defineAuthChallenge } from "./define-auth-challenge/resource"
import { verifyAuthChallengeResponse } from "./verify-auth-challenge-response/resource"
import { preSignUp } from "./pre-sign-up/resource";
import { postConfirmation } from "./post-sign-up-confirmation/resource";
export const auth = defineAuth({
  loginWith: { email: true },
  groups: ['Admin', 'Owner', 'Member'],
  multifactor: {
    mode: 'OPTIONAL', // Owners will be forced in-app
    totp: true,
    sms: false,
  },
  triggers: {
    createAuthChallenge,
    defineAuthChallenge,
    verifyAuthChallengeResponse,
    preSignUp,
    postConfirmation
  },
});

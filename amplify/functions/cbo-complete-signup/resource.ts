import { defineFunction } from '@aws-amplify/backend';
//TODO: switch secrect to kms

export const cboCompleteSignupFn = defineFunction({
  name: 'cbo-complete-signup',
  entry: './handler.ts',
  environment: {
    
      JOIN_TABLE: 'JoinRequest_DB',
      CBO_TABLE: 'CBO_DB',
      INVITE_HMAC_SECRET: 'yYt0vJPv2sM0J8sQm3fF1jR9kG5dNq7uLx4A2wZ6bH8cE3pT1U9rV7oQ5M3nD1sB',
      MEMBERS_GROUP: 'Member',
    },
  
});

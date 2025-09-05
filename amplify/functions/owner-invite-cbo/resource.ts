import { defineFunction } from '@aws-amplify/backend';
//TODO: switch secrect to kms
export const ownerInviteCboFn = defineFunction({
    name: 'owner-invite-cbo',
    entry: './handler.ts',
    environment: {

        JOIN_TABLE: 'JoinRequest_DB',
        FRONTEND_BASE_URL: 'https://www.bid2clean.com', // ← set to your actual app URL
        SES_FROM_EMAIL: 'noreply@bid2clean.com',       // ← verified SES identity
        INVITE_TTL_HOURS: '48',  
        INVITE_HMAC_SECRET: 'yYt0vJPv2sM0J8sQm3fF1jR9kG5dNq7uLx4A2wZ6bH8cE3pT1U9rV7oQ5M3nD1sB',
    },

});

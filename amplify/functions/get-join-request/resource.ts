import { defineFunction } from '@aws-amplify/backend';

export const getJoinRequestFn = defineFunction({
    name: 'get-join-request',
    entry: './handler.ts',
    environment: {

        JOIN_TABLE: 'JoinRequest_DB',
    },

});

import { defineFunction } from '@aws-amplify/backend';

export const updateQuoteRoomsFn = defineFunction({
  name: 'update-quote-rooms',
  entry: './handler.ts',
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
  },
});

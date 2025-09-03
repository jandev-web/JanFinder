import { defineFunction } from '@aws-amplify/backend';

export const sendTransferRequestFn = defineFunction({
  name: 'send-transfer-request',
  entry: './handler.ts',
  environment: {
    SELL_REQUEST_TABLE: 'SellRequest_DB',
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes', 
  },
});

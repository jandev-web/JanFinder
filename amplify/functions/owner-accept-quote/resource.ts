// amplify/functions/owner-accept-quote/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const ownerAcceptQuoteFn = defineFunction({
  name: 'OwnerAcceptQuote',
  entry: './handler.ts',
  resourceGroupName: 'data',
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
    GET_QUOTE_PDF_FUNCTION_NAME: 'get-quote-pdf',
    SEND_QUOTE_EMAIL_FUNCTION_NAME: 'send-quote-acceptance-email',
  },
});

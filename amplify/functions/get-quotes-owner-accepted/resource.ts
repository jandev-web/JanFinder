// amplify/functions/get-quotes-owner-accepted/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const getAcceptedQuotesOwnerFn = defineFunction({
  name: 'get-quotes-owner-accepted',
  entry: './handler.ts',
  runtime: 20, // nodejs20.x if your project uses 20; otherwise 18
  environment: {
    QUOTES_TABLE_NAME: 'CustomerQuotes',
    FRANCHISE_INDEX_NAME: 'FranchiseIndex',
    OWNER_INDEX_NAME: 'OwnerIndex',
    SELL_REQUEST_TABLE_NAME: 'SellRequest_DB',
    SELL_REQUEST_QUOTE_GSI: 'QuoteID-index',
  },
});

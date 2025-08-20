// amplify/data/resource.ts
import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { getFacilityOptionsFn } from '../functions/get-facility-options/resource';
import { createCustomerQuoteFn } from '../functions/create-customer-quote/resource';
import { calcPackageOptionsFn } from '../functions/calc-package-options/resource';
import { updateQuoteBudgetFn } from '../functions/update-quote-budget/resource';
import { updateCustomerInfoFn } from '../functions/update-customer-info/resource';
import { updateFacilityTypeFn } from '../functions/update-facility-type/resource';
import { updateFloorInfoFn } from '../functions/update-floor-info/resource';
import { confirmQuoteFn } from '../functions/confirm-quote/resource';
import { getQuoteFn } from '../functions/get-quote/resource';
import { updateQuoteRoomsFn } from '../functions/update-quote-rooms/resource';
import { updatePackageChoiceFn } from '../functions/update-package-choice/resource';
import { sendQuoteConfirmationEmailFn } from '../functions/send-quote-confirmation-email/resource';
import { updateQuoteFrequencyFn } from '../functions/update-quote-frequency/resource';

const schema = a.schema({
  getFacilityOptions: a
    .query()
    .returns(a.json())
    .authorization((allow) => [allow.guest(), allow.authenticated('identityPool')]) // or your choice
    .handler(a.handler.function(getFacilityOptionsFn)),
  createCustomerQuote: a
    .query()
    .returns(a.json())
    .authorization(allow => [allow.authenticated('identityPool'),
    allow.guest(),])
    .handler(a.handler.function(createCustomerQuoteFn)),
  calculatePackageOptions: a
    .query()
    .arguments({ quoteID: a.string() })
    .returns(a.json())
    .authorization(allow => [allow.guest(), allow.authenticated('identityPool')])
    .handler(a.handler.function(calcPackageOptionsFn)),
  updateQuoteBudget: a
    .query()
    .arguments({
      quoteID: a.string(),
      budget: a.float(),
    })
    .returns(a.json())
    .authorization(allow => [allow.guest(), allow.authenticated('identityPool')]) // signed-in users
    .handler(a.handler.function(updateQuoteBudgetFn)),
  updateCustomerInfo: a
    .query()
    .arguments({
      quoteID: a.string(),
      customerInfo: a.json(), // or build an object type if you want strict typing
    })
    .returns(a.json())
    .authorization((allow) => [allow.guest(), allow.authenticated('identityPool')])
    .handler(a.handler.function(updateCustomerInfoFn)),
  updateFacilityType: a
    .query()
    .arguments({
      quoteID: a.string(),
      facilityType: a.string(),
    })
    .returns(a.json())
    .authorization(allow => [allow.guest(), allow.authenticated('identityPool')])
    .handler(a.handler.function(updateFacilityTypeFn)),
  updateFloorInfo: a
    .query()
    .arguments({
      quoteID: a.string(),
      floorInfo: a.json(), // { floors: number, stairwells: {carpetStairwells?, hardfloorStairwells?} }
    })
    .returns(a.json())
    .authorization(allow => [allow.guest(), allow.authenticated('identityPool')])
    .handler(a.handler.function(updateFloorInfoFn)),
  confirmQuote: a
    .query()
    .arguments({ quoteID: a.string() })
    .returns(a.json())
    .authorization(allow => [allow.guest(), allow.authenticated('identityPool')]) // ⬅️ per your request
    .handler(a.handler.function(confirmQuoteFn)),
  getQuote: a
    .query()
    .arguments({ quoteID: a.string() })
    .returns(a.json())
    .authorization(allow => [allow.guest(), allow.authenticated('identityPool')]) // ⬅️ guest access
    .handler(a.handler.function(getQuoteFn)),
  updateQuoteRooms: a
    .query()
    .arguments({
      quoteID: a.string(),
      formInfo: a.json(), // { roomTypes: [], sqft: number, floorTypes: { ... } }
    })
    .returns(a.json())
    .authorization(allow => [allow.guest(), allow.authenticated('identityPool')]) // ⬅️ guest
    .handler(a.handler.function(updateQuoteRoomsFn)),
  updatePackageChoice: a
    .query()
    .arguments({
      quoteID: a.string(),
      packageInfo: a.json(),
    })
    .returns(a.json())
    .authorization(allow => [allow.guest(), allow.authenticated('identityPool')]) // ⬅️ guest
    .handler(a.handler.function(updatePackageChoiceFn)),
  sendQuoteConfirmationEmail: a
    .query()
    .arguments({ quoteID: a.string() })
    .returns(a.json())
    .authorization(allow => [allow.guest(), allow.authenticated('identityPool')]) // ⬅️ guest
    .handler(a.handler.function(sendQuoteConfirmationEmailFn)),
  updateQuoteFrequency: a
    .query()
    .arguments({ quoteID: a.string(), frequency: a.string() })
    .returns(a.json())
    .authorization(allow => [allow.guest(), allow.authenticated('identityPool')])
    .handler(a.handler.function(updateQuoteFrequencyFn)),

});
export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: { defaultAuthorizationMode: 'iam' },
});

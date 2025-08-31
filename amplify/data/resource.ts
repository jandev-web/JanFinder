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
import { getOwnerFn } from '../functions/get-owner/resource';
import { getFranchiseFn } from '../functions/get-franchise/resource';
import { getAvailableQuotesOwnerFn } from '../functions/get-quotes-owner-available/resource';
import { ownerAcceptQuoteFn } from '../functions/owner-accept-quote/resource';
import { setFranchiseTemplateFn } from '../functions/set-franchise-template/resource';
import { validateQuoteTemplateProxyFn as testFranchiseQuoteTemplateFn } from '../functions/validate-quote-template-proxy/resource';

console.log('[Synth] data.defaultAuthorizationMode = iam');
console.log('[Synth] createCustomerQuote auth = guest + identityPool');

const schema = a.schema({
  getFacilityOptions: a.query().returns(a.json())
    .authorization(allow => [allow.authenticated('identityPool'), allow.authenticated(), allow.guest()])
    .handler(a.handler.function(getFacilityOptionsFn)),
  createCustomerQuote: a.query().returns(a.json())
    .authorization(allow => [allow.authenticated('identityPool'), allow.authenticated(), allow.guest()])
    .handler(a.handler.function(createCustomerQuoteFn)),
  calculatePackageOptions: a.query().arguments({ quoteID: a.string() }).returns(a.json())
    .authorization(allow => [allow.authenticated('identityPool'), allow.authenticated(), allow.guest()])
    .handler(a.handler.function(calcPackageOptionsFn)),
  updateQuoteBudget: a.query().arguments({ quoteID: a.string(), budget: a.float() }).returns(a.json())
    .authorization(allow => [allow.authenticated('identityPool'), allow.authenticated(), allow.guest()])
    .handler(a.handler.function(updateQuoteBudgetFn)),
  updateCustomerInfo: a.query().arguments({ quoteID: a.string(), customerInfo: a.json() }).returns(a.json())
    .authorization(allow => [allow.authenticated('identityPool'), allow.authenticated(), allow.guest()])
    .handler(a.handler.function(updateCustomerInfoFn)),
  updateFacilityType: a.query().arguments({ quoteID: a.string(), facilityType: a.string() }).returns(a.json())
    .authorization(allow => [allow.authenticated('identityPool'), allow.authenticated(), allow.guest()])
    .handler(a.handler.function(updateFacilityTypeFn)),
  updateFloorInfo: a.query().arguments({ quoteID: a.string(), floorInfo: a.json() }).returns(a.json())
    .authorization(allow => [allow.authenticated('identityPool'), allow.authenticated(), allow.guest()])
    .handler(a.handler.function(updateFloorInfoFn)),
  confirmQuote: a.query().arguments({ quoteID: a.string() }).returns(a.json())
    .authorization(allow => [allow.authenticated('identityPool'), allow.authenticated(), allow.guest()])
    .handler(a.handler.function(confirmQuoteFn)),
  getQuote: a.query().arguments({ quoteID: a.string() }).returns(a.json())
    .authorization(allow => [allow.authenticated('identityPool'), allow.authenticated(), allow.guest()])
    .handler(a.handler.function(getQuoteFn)),
  updateQuoteRooms: a.query().arguments({ quoteID: a.string(), formInfo: a.json() }).returns(a.json())
    .authorization(allow => [allow.authenticated('identityPool'), allow.authenticated(), allow.guest()])
    .handler(a.handler.function(updateQuoteRoomsFn)),
  updatePackageChoice: a.query().arguments({ quoteID: a.string(), packageInfo: a.json() }).returns(a.json())
    .authorization(allow => [allow.authenticated('identityPool'), allow.authenticated(), allow.guest()])
    .handler(a.handler.function(updatePackageChoiceFn)),
  sendQuoteConfirmationEmail: a.query().arguments({ quoteID: a.string() }).returns(a.json())
    .authorization(allow => [allow.authenticated('identityPool'), allow.authenticated(), allow.guest()])
    .handler(a.handler.function(sendQuoteConfirmationEmailFn)),
  updateQuoteFrequency: a.query().arguments({ quoteID: a.string(), frequency: a.string() }).returns(a.json())
    .authorization(allow => [allow.authenticated('identityPool'), allow.authenticated(), allow.guest()])
    .handler(a.handler.function(updateQuoteFrequencyFn)),
  getOwnerById: a.query().arguments({ id: a.string().required() }).returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(getOwnerFn)),
  getFranchiseInfo: a.query().arguments({ franchiseID: a.string().required() }).returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(getFranchiseFn)),
  getAvailableQuotesOwner: a.query().returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(getAvailableQuotesOwnerFn)),
  ownerAcceptQuote: a.mutation().arguments({
    quoteID: a.string().required(),
    franchiseID: a.string().required(),
    ownerID: a.string().required(),
  }).returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(ownerAcceptQuoteFn)),
  setFranchiseTemplate: a.mutation().arguments({
    franchiseID: a.string().required(),
    templateType: a.string().required(),
    isThere: a.boolean().required(),
  }).returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(setFranchiseTemplateFn)),
  testFranchiseQuoteTemplate: a.mutation()
    .arguments({ franchiseID: a.string().required() })
    .returns(a.json())
    .authorization(allow => [
      allow.authenticated(),                 // user pool
      allow.authenticated('identityPool'),   // ← add this
    ])
    .handler(a.handler.function(testFranchiseQuoteTemplateFn)),
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: { defaultAuthorizationMode: 'iam' },
});

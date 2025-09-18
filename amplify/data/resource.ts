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
import { getAcceptedQuotesOwnerFn } from '../functions/get-quotes-owner-accepted/resource';
import { sendTransferRequestFn } from '../functions/owner-send-transfer-request/resource';
import { ownerGetAllMembersFn } from '../functions/owner-get-all-members/resource';
import { updateFranchiseInfoFn } from '../functions/update-franchise-info/resource';
import { addCboFranchiseFn } from '../functions/add-cbo-franchise/resource';
import { ownerInviteCboFn } from '../functions/owner-invite-cbo/resource';
import { getJoinRequestFn } from '../functions/get-join-request/resource';
import { cboCompleteSignupFn } from '../functions/cbo-complete-signup/resource';
import { getCboFn } from '../functions/get-cbo/resource';
import { memberAcceptSellRequestFn } from '../functions/member-accept-sell-request/resource';
import { memberGetAvailableQuotesFn } from '../functions/member-get-available-quotes/resource';
import { getPendingSellRequestsFn } from '../functions/get-pending-sell-requests/resource';
import { clearPackagesFn } from '../functions/clear-packages/resource';

// Proxies (Node) → Python validators
import { validateQuoteTemplateProxyFn as testFranchiseQuoteTemplateFn } from '../functions/validate-quote-template-proxy/resource';
import { validateContractTemplateProxyFn as testFranchiseContractTemplateFn } from '../functions/validate-contract-template-proxy/resource'; // NEW

// Deleters
import { deleteFranchiseQuoteTemplateFn } from '../functions/delete-franchise-quote-template/resource';
import { deleteFranchiseContractTemplateFn } from '../functions/delete-franchise-contract-template/resource'; // NEW

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
  updatePackageChoice: a.query().arguments({ quoteID: a.string(), packageChoice: a.json() }).returns(a.json())
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
    templateType: a.string().required(), // 'quote' | 'contract'
    isThere: a.boolean().required(),
  }).returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(setFranchiseTemplateFn)),
  getAcceptedQuotesOwner: a.query()
    .arguments({
      franchiseID: a.string().required(),
      ownerID: a.string().required(),
    })
    .returns(a.json())
    .authorization(allow => [
      allow.authenticated(),                // User Pool
      allow.authenticated('identityPool'),  // (optional) Identity Pool
    ])
    .handler(a.handler.function(getAcceptedQuotesOwnerFn)),
  sendTransferRequest: a.mutation()
    .arguments({
      quoteID: a.string().required(),
      ownerID: a.string().required(),
      targetUser: a.string().required(), // CBOID or email or CleanID
    })
    .returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(sendTransferRequestFn)),
  ownerGetAllMembers: a.query()
    .arguments({ ownerID: a.string().required() })
    .returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(ownerGetAllMembersFn)),
  updateFranchiseInfo: a.mutation()
    .arguments({
      franchiseID: a.string().required(),
      ownerID: a.string().required(),
      franchiseName: a.string().required(),
      franchiseAddress: a.json().required(),
      serviceRegions: a.string().array().required(),
    })
    .returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(updateFranchiseInfoFn)),
  addCBOFranchise: a.mutation()
    .arguments({
      franchiseID: a.string().required(),
      member: a.json().required(),
    })
    .returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(addCboFranchiseFn)),
  getCBOById: a.query()
    .arguments({ id: a.string().required() })
    .returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(getCboFn)),
  // ===== Validators =====
  testFranchiseQuoteTemplate: a.mutation()
    .arguments({ franchiseID: a.string().required() })
    .returns(a.json())
    .authorization(allow => [allow.authenticated(), allow.authenticated('identityPool')])
    .handler(a.handler.function(testFranchiseQuoteTemplateFn)),

  testFranchiseContractTemplate: a.mutation() // NEW
    .arguments({ franchiseID: a.string().required() })
    .returns(a.json())
    .authorization(allow => [allow.authenticated(), allow.authenticated('identityPool')])
    .handler(a.handler.function(testFranchiseContractTemplateFn)),
  memberAcceptSellRequest: a.mutation()
    .arguments({
      requestID: a.string().required(),
      memberCBOID: a.string().required(),
      timezone: a.string(), // optional
    })
    .returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(memberAcceptSellRequestFn)),

  // ===== Deleters =====
  deleteFranchiseQuoteTemplate: a.mutation()
    .arguments({ franchiseID: a.string().required() })
    .returns(a.json())
    .authorization(allow => [allow.authenticated(), allow.authenticated('identityPool')])
    .handler(a.handler.function(deleteFranchiseQuoteTemplateFn)),

  deleteFranchiseContractTemplate: a.mutation() // NEW
    .arguments({ franchiseID: a.string().required() })
    .returns(a.json())
    .authorization(allow => [allow.authenticated(), allow.authenticated('identityPool')])
    .handler(a.handler.function(deleteFranchiseContractTemplateFn)),
  ownerInviteCBO: a.mutation()
    .arguments({ franchiseID: a.string().required(), email: a.string().required() })
    .returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(ownerInviteCboFn)),

  getJoinRequest: a.query()
    .arguments({ requestId: a.string().required() })
    .returns(a.json())
    .authorization(allow => [allow.authenticated(), allow.authenticated('identityPool')])
    .handler(a.handler.function(getJoinRequestFn)),

  cboCompleteSignup: a.mutation()
    .arguments({
      token: a.string().required(),      // signed invite token
      firstName: a.string().required(),
      lastName: a.string().required(),
      phone: a.string(),
      street: a.string(),
      city: a.string(),
      state: a.string(),
      postalCode: a.string(),
      country: a.string(),
    })
    .returns(a.json())
    .authorization(allow => [allow.authenticated()]) // CBO must be signed-in
    .handler(a.handler.function(cboCompleteSignupFn)),
  memberGetAvailableQuotes: a.query()
    .arguments({
      memberID: a.string().required(), // the TargetUser value (e.g., CBOID/email)
    })
    .returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(memberGetAvailableQuotesFn)),
  getPendingSellRequests: a.query()
    .arguments({
      ownerID: a.string().required(),
      quoteID: a.string().required(),
    })
    .returns(a.json())
    .authorization(allow => [allow.authenticated()]) // same as your other owner queries
    .handler(a.handler.function(getPendingSellRequestsFn)),
  clearPackages: a
    .query() 
    .arguments({ quoteID: a.string().required() })
    .returns(a.json())
    .authorization(allow => [
      allow.authenticated('identityPool'),
      allow.authenticated(),
      allow.guest(),
    ])
    .handler(a.handler.function(clearPackagesFn)),

});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: { defaultAuthorizationMode: 'iam' },
});

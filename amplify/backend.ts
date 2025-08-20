// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { Stack, Aws, aws_iam as iam, aws_lambda as lambda } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { postConfirmation } from './auth/post-sign-up-confirmation/resource';

// AppSync resolver / utility functions (these are bound in amplify/data/resource.ts)
import { createCustomerQuoteFn } from './functions/create-customer-quote/resource';
import { getFacilityOptionsFn } from './functions/get-facility-options/resource';
import { calcPackageOptionsFn } from './functions/calc-package-options/resource';
import { updateQuoteBudgetFn } from './functions/update-quote-budget/resource';
import { updateCustomerInfoFn } from './functions/update-customer-info/resource';
import { updateFacilityTypeFn } from './functions/update-facility-type/resource';
import { updateFloorInfoFn } from './functions/update-floor-info/resource';
import { confirmQuoteFn } from './functions/confirm-quote/resource';
import { getQuoteFn } from './functions/get-quote/resource';
import { updateQuoteRoomsFn } from './functions/update-quote-rooms/resource';
import { updatePackageChoiceFn } from './functions/update-package-choice/resource';
import { sendQuoteConfirmationEmailFn } from './functions/send-quote-confirmation-email/resource';
import { updateQuoteFrequencyFn } from './functions/update-quote-frequency/resource';

// 1) Bind resources
const backend = defineBackend({
  auth,
  data,
  storage,
  postConfirmation,
  createCustomerQuoteFn,
  getFacilityOptionsFn,
  calcPackageOptionsFn,
  updateQuoteBudgetFn,
  updateCustomerInfoFn,
  updateFacilityTypeFn,
  updateFloorInfoFn,
  confirmQuoteFn,
  getQuoteFn,
  updateQuoteRoomsFn,
  updatePackageChoiceFn,
  sendQuoteConfirmationEmailFn,
  updateQuoteFrequencyFn,
});

// 2) Cognito user pool tweaks
const { cfnUserPool } = backend.auth.resources.cfnResources;

const existing = Array.isArray(cfnUserPool.schema) ? [...cfnUserPool.schema] : [];
let modified = false;

const addCustomStringAttr = (name: string) => {
  if (!existing.some((a: any) => a?.name === name)) {
    existing.push({
      name,
      attributeDataType: 'String',
      mutable: true,
      required: false,
      stringAttributeConstraints: { minLength: '1', maxLength: '50' },
    });
    modified = true;
  }
};
addCustomStringAttr('role');
addCustomStringAttr('FranchiseID');
if (modified) cfnUserPool.schema = existing;

cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 12,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
  },
};

// 3) IAM: allow Identity Pool roles to call this AppSync API (IAM mode)
//    IMPORTANT: attach from the DATA stack using role NAMES (strings) to avoid auth -> data edge.
const region = Stack.of(backend.data.stack).region; // use data stack's region
const account = Aws.ACCOUNT_ID;
const apiId = backend.data.resources.graphqlApi.apiId;
const appsyncResourceArn = `arn:${Aws.PARTITION}:appsync:${region}:${account}:apis/${apiId}/*`;

// Get role NAMES (string) — safe to pass to CfnPolicy without creating a construct ref edge
const unauthRoleName = (backend.auth.resources as any).unauthenticatedUserIamRole.roleName;
const authRoleName   = (backend.auth.resources as any).authenticatedUserIamRole.roleName;

// Create the policy IN THE DATA STACK and attach to the identity pool roles by name
new iam.CfnPolicy(backend.data.stack, 'IdentityPoolGraphQLPolicy', {
  policyName: 'IdentityPoolGraphQLPolicy',
  roles: [unauthRoleName, authRoleName],
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: 'appsync:GraphQL',
        Resource: appsyncResourceArn,
      },
    ],
  },
});

// 4) Convenience refs
const postConfFn = backend.postConfirmation.resources.lambda as lambda.Function;
const createQuoteFn = backend.createCustomerQuoteFn.resources.lambda as lambda.Function;
const calcFn = backend.calcPackageOptionsFn.resources.lambda as lambda.Function;
const updBudgetFn = backend.updateQuoteBudgetFn.resources.lambda as lambda.Function;
const updCustomerFn = backend.updateCustomerInfoFn.resources.lambda as lambda.Function;
const updFacilityFn = backend.updateFacilityTypeFn.resources.lambda as lambda.Function;
const updFloorFn = backend.updateFloorInfoFn.resources.lambda as lambda.Function;
const confirmFn = backend.confirmQuoteFn.resources.lambda as lambda.Function;
const getQuoteLambda = backend.getQuoteFn.resources.lambda as lambda.Function;
const updQuoteRoomsLambda = backend.updateQuoteRoomsFn.resources.lambda as lambda.Function;
const updatePkgLambda = backend.updatePackageChoiceFn.resources.lambda as lambda.Function;
const sendEmailLambda = backend.sendQuoteConfirmationEmailFn.resources.lambda as lambda.Function;
const updFrequencyFn = backend.updateQuoteFrequencyFn.resources.lambda as lambda.Function;

// 5) DDB/SES/Lambda permissions for the above
sendEmailLambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:GetItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/CustomerQuotes`],
  })
);
sendEmailLambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['ses:SendEmail', 'ses:SendRawEmail'],
    resources: ['*'],
  })
);

updatePkgLambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:UpdateItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/CustomerQuotes`],
  })
);
updQuoteRoomsLambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:UpdateItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/CustomerQuotes`],
  })
);
getQuoteLambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:GetItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/CustomerQuotes`],
  })
);
confirmFn.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:GetItem', 'dynamodb:UpdateItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/CustomerQuotes`],
  })
);
confirmFn.addToRolePolicy(
  new PolicyStatement({
    actions: ['lambda:InvokeFunction'],
    resources: [`arn:aws:lambda:${region}:${account}:function:SendCustomerConfirmationEmail`],
  })
);

updFloorFn.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:UpdateItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/CustomerQuotes`],
  })
);
updFacilityFn.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:UpdateItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/CustomerQuotes`],
  })
);
updCustomerFn.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:UpdateItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/CustomerQuotes`],
  })
);
updBudgetFn.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:UpdateItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/CustomerQuotes`],
  })
);
updFrequencyFn.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:UpdateItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/CustomerQuotes`],
  })
);
calcFn.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:GetItem'],
    resources: [
      `arn:aws:dynamodb:${region}:${account}:table/CustomerQuotes`,
      `arn:aws:dynamodb:${region}:${account}:table/RoomTaskCalculations`,
      `arn:aws:dynamodb:${region}:${account}:table/Facility_Data`,
    ],
  })
);
calcFn.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:UpdateItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/CustomerQuotes`],
  })
);
createQuoteFn.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:PutItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/CustomerQuotes`],
  })
);

// Auth trigger policies
const userPoolWildcardArn = `arn:${Aws.PARTITION}:cognito-idp:${region}:${account}:userpool/*`;
postConfFn.addToRolePolicy(
  new PolicyStatement({
    actions: ['cognito-idp:AdminAddUserToGroup'],
    resources: [userPoolWildcardArn],
  })
);
postConfFn.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:PutItem'],
    resources: [
      `arn:aws:dynamodb:${region}:${account}:table/Owner_DB`,
      `arn:aws:dynamodb:${region}:${account}:table/Franchise_DB`,
    ],
  })
);

export default backend;

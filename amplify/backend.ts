// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { Stack, Duration, Aws, aws_iam as iam, aws_lambda as lambda, aws_s3 as s3, } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { postConfirmation } from './auth/post-sign-up-confirmation/resource';

// AppSync resolver / utility functions (bound in amplify/data/resource.ts)
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
import { getOwnerFn } from './functions/get-owner/resource';
import { getFranchiseFn } from './functions/get-franchise/resource';
import { getAvailableQuotesOwnerFn } from './functions/get-quotes-owner-available/resource';
import { ownerAcceptQuoteFn } from './functions/owner-accept-quote/resource';
import { sendQuoteAcceptanceEmailFn } from './functions/send-quote-acceptance-email/resource';
import { setFranchiseTemplateFn } from './functions/set-franchise-template/resource';

// 1) Bind resources (as-is)
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
  getOwnerFn,
  getFranchiseFn,
  getAvailableQuotesOwnerFn,
  ownerAcceptQuoteFn,
  sendQuoteAcceptanceEmailFn,
  setFranchiseTemplateFn,
});

// === Locals ===
const region = Stack.of(backend.data.stack).region;
const account = Aws.ACCOUNT_ID;
const partition = Aws.PARTITION;
const tableArn = (name: string) => `arn:${partition}:dynamodb:${region}:${account}:table/${name}`;
const tableIndexArn = (name: string) => `${tableArn(name)}/index/*`;

// 2) Cognito user pool tweaks (keep only what app likely needs)
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
addCustomStringAttr('role');        // CHANGE: keep custom attrs (your app reads these)
addCustomStringAttr('FranchiseID'); // CHANGE: keep custom attrs
if (modified) cfnUserPool.schema = existing;

// CHANGE: keep a simple password policy; remove everything else (no advanced security / recovery knobs)
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 12,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
  },
};

// 3) Minimal IAM to allow Identity Pool roles to call AppSync (keep; simplifies client calls with IAM)
const apiId = backend.data.resources.graphqlApi.apiId;
const appsyncResourceArn = `arn:${partition}:appsync:${region}:${account}:apis/${apiId}/*`;      // CHANGE: fixed template string
const appsyncTypesArn = `arn:${partition}:appsync:${region}:${account}:apis/${apiId}/types/*`;  // CHANGE: fixed template string

const authRes = backend.auth.resources as any;
const discoveredRoleNames = new Set<string>();
for (const v of Object.values(authRes ?? {})) {
  const rn = (v as any)?.roleName;
  if (typeof rn === 'string' && rn.length > 0) discoveredRoleNames.add(rn);
}
for (const v of Object.values(authRes ?? {})) {
  const rn = (v as any)?.roleName;
  if (typeof rn === 'string' && /GroupRole/i.test(rn)) discoveredRoleNames.add(rn);
}

new iam.CfnPolicy(backend.data.stack, 'IdentityPoolGraphQLPolicyV2', {
  policyName: 'IdentityPoolGraphQLPolicyV2',
  roles: Array.from(discoveredRoleNames),
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      { Effect: 'Allow', Action: 'appsync:GraphQL', Resource: [appsyncResourceArn, appsyncTypesArn] },
    ],
  },
});

// 4) Storage + simple Lambdas used by your flows
const contractBucket = backend.storage.resources.bucket;
// === S3 identity policy for all auth + group roles (covers protected uploads) ===
const bucketArn = contractBucket.bucketArn;

// amplify/backend.ts (after you compute discoveredRoleNames and have contractBucket)
new iam.CfnPolicy(backend.data.stack, 'IdentityPoolS3PublicRW', {
  policyName: 'IdentityPoolS3PublicRW',
  roles: Array.from(discoveredRoleNames),
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          's3:PutObject','s3:GetObject','s3:DeleteObject',
          's3:AbortMultipartUpload','s3:ListMultipartUploadParts'
        ],
        Resource: [`${contractBucket.bucketArn}/public/*`],
      },
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket','s3:ListBucketMultipartUploads'],
        Resource: [contractBucket.bucketArn],
        Condition: { StringLike: { 's3:prefix': ['public/*'] } }
      }
    ]
  }
});


// CHANGE: keep the docgen layer if your convert function needs native deps (lxml/Adobe); otherwise delete this block and remove `layers` from the function below.
const docgenDepsLayer = new lambda.LayerVersion(backend.data.stack, 'DocgenDepsLayer', {
  code: lambda.Code.fromAsset('amplify/layers/docgen-deps'),
  compatibleRuntimes: [lambda.Runtime.PYTHON_3_12, lambda.Runtime.PYTHON_3_11],
  description: 'Doc/PDF deps',
});

// Convenience refs for functions defined in other files
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
const getOwnerLambda = backend.getOwnerFn.resources.lambda as lambda.Function;
const getFranchiseLambda = backend.getFranchiseFn.resources.lambda as lambda.Function;
const getAvailableQuotesOwnerLambda = backend.getAvailableQuotesOwnerFn.resources.lambda as lambda.Function;
const ownerAcceptQuoteLambda = backend.ownerAcceptQuoteFn.resources.lambda as lambda.Function;
const sendOwnerAcceptanceEmailLambda = backend.sendQuoteAcceptanceEmailFn.resources.lambda as lambda.Function;
const setFranchiseTemplateLambda = backend.setFranchiseTemplateFn.resources.lambda;

// Minimal custom functions defined here (no tracing/logGroup extras)
const getQuotePDFLambda = new lambda.Function(backend.data.stack, 'GetQuotePdfFn', {
  functionName: 'get-quote-pdf',
  runtime: lambda.Runtime.PYTHON_3_12,
  handler: 'handler.lambda_handler',
  code: lambda.Code.fromAsset('amplify/functions/get-quote-pdf'),
  timeout: Duration.minutes(2),
  memorySize: 1024,
  layers: [docgenDepsLayer],      
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
    OWNER_TABLE: 'Owner_DB',
    FRANCHISE_TABLE: 'Franchise_DB',
    QUOTE_PDF_BUCKET_NAME: contractBucket.bucketName,
    CONVERT_LAMBDA_NAME: 'convert-docx-to-pdf', // CHANGE: corrected name; overwritten below with actual function name
  },
});

const convertDocxToPdfLambda = new lambda.Function(backend.data.stack, 'ConvertDocxToPdfFn', {
  functionName: 'convert-docx-to-pdf',
  runtime: lambda.Runtime.PYTHON_3_12,
  architecture: lambda.Architecture.X86_64,
  handler: 'handler.lambda_handler',
  code: lambda.Code.fromAsset('amplify/functions/convert-docx-to-pdf'),
  timeout: Duration.minutes(3),
  memorySize: 1536,
  layers: [docgenDepsLayer], // CHANGE: keep only if needed by your code
  environment: {
    CONTRACT_BUCKET: contractBucket.bucketName,
    ADOBE_SECRET_NAME: 'adobe-credentials',
  },
});

// Basic grants (avoid hard-coded ARNs)
contractBucket.grantReadWrite(getQuotePDFLambda);
contractBucket.grantReadWrite(convertDocxToPdfLambda);
contractBucket.grantRead(sendOwnerAcceptanceEmailLambda); 
// Minimal invoke relationships
convertDocxToPdfLambda.grantInvoke(getQuotePDFLambda);
getQuotePDFLambda.addEnvironment('CONVERT_LAMBDA_NAME', convertDocxToPdfLambda.functionName); // CHANGE: ensure runtime uses actual name
getQuotePDFLambda.grantInvoke(ownerAcceptQuoteLambda);
sendOwnerAcceptanceEmailLambda.grantInvoke(ownerAcceptQuoteLambda);
sendOwnerAcceptanceEmailLambda.grantInvoke(getQuotePDFLambda);
getQuotePDFLambda.addEnvironment(
  'SEND_QUOTE_EMAIL_FUNCTION_NAME',
  sendOwnerAcceptanceEmailLambda.functionName
);
ownerAcceptQuoteLambda.addEnvironment('GET_QUOTE_PDF_FUNCTION_NAME', getQuotePDFLambda.functionName);
ownerAcceptQuoteLambda.addEnvironment('SEND_QUOTE_EMAIL_FUNCTION_NAME', sendOwnerAcceptanceEmailLambda.functionName);
sendOwnerAcceptanceEmailLambda.addEnvironment('QUOTE_PDF_BUCKET_NAME', contractBucket.bucketName);
// === Minimal DynamoDB/SES permissions (grouped; no hard-coded ARNs) ===
setFranchiseTemplateLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:UpdateItem', 'dynamodb:GetItem'],
  resources: [tableArn('Franchise_DB')],
}));

getQuotePDFLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:GetItem', 'dynamodb:UpdateItem'],
  resources: [tableArn('CustomerQuotes'), tableArn('Owner_DB'), tableArn('Franchise_DB')],
}));

sendOwnerAcceptanceEmailLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:GetItem'],
  resources: [tableArn('CustomerQuotes'), tableArn('Franchise_DB')],
}));
sendOwnerAcceptanceEmailLambda.addToRolePolicy(new PolicyStatement({
  actions: ['ses:SendRawEmail'],
  resources: ['*'],
}));

// (Optional dependency) allow convert lambda to read the Adobe secret if your code does that
convertDocxToPdfLambda.addToRolePolicy(new PolicyStatement({
  actions: ['secretsmanager:GetSecretValue'],
  resources: [`arn:${partition}:secretsmanager:${region}:${account}:secret:adobe-credentials*`],
}));

// Quote flow DDB access kept simple
ownerAcceptQuoteLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:GetItem', 'dynamodb:UpdateItem', 'dynamodb:DescribeTable'],
  resources: [tableArn('CustomerQuotes'), tableIndexArn('CustomerQuotes')],
}));

getAvailableQuotesOwnerLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:Query', 'dynamodb:DescribeTable'],
  resources: [tableArn('CustomerQuotes'), tableIndexArn('CustomerQuotes')],
}));

getFranchiseLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:Query', 'dynamodb:GetItem', 'dynamodb:DescribeTable'],
  resources: [tableArn('Franchise_DB'), tableIndexArn('Franchise_DB')],
}));

getOwnerLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:Query', 'dynamodb:GetItem', 'dynamodb:DescribeTable'],
  resources: [tableArn('Owner_DB'), tableIndexArn('Owner_DB')],
}));

sendEmailLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:GetItem'],
  resources: [tableArn('CustomerQuotes')],
}));
sendEmailLambda.addToRolePolicy(new PolicyStatement({
  actions: ['ses:SendEmail', 'ses:SendRawEmail'],
  resources: ['*'],
}));

updatePkgLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:UpdateItem'],
  resources: [tableArn('CustomerQuotes')],
}));
updQuoteRoomsLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:UpdateItem'],
  resources: [tableArn('CustomerQuotes')],
}));
getQuoteLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:GetItem'],
  resources: [tableArn('CustomerQuotes')],
}));
confirmFn.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:GetItem', 'dynamodb:UpdateItem'],
  resources: [tableArn('CustomerQuotes')],
}));

updFloorFn.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:UpdateItem'],
  resources: [tableArn('CustomerQuotes')],
}));
updFacilityFn.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:UpdateItem'],
  resources: [tableArn('CustomerQuotes')],
}));
updCustomerFn.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:UpdateItem'],
  resources: [tableArn('CustomerQuotes')],
}));
updBudgetFn.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:UpdateItem'],
  resources: [tableArn('CustomerQuotes')],
}));
updFrequencyFn.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:UpdateItem'],
  resources: [tableArn('CustomerQuotes')],
}));
calcFn.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:GetItem'],
  resources: [tableArn('CustomerQuotes'), tableArn('RoomTaskCalculations'), tableArn('Facility_Data')],
}));
calcFn.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:UpdateItem'],
  resources: [tableArn('CustomerQuotes')],
}));
createQuoteFn.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:PutItem'],
  resources: [tableArn('CustomerQuotes')],
}));

// Auth trigger policies (kept minimal)
const userPoolWildcardArn = `arn:${partition}:cognito-idp:${region}:${account}:userpool/*`;
postConfFn.addToRolePolicy(new PolicyStatement({
  actions: ['cognito-idp:AdminAddUserToGroup'],
  resources: [userPoolWildcardArn],
}));
postConfFn.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:PutItem'],
  resources: [tableArn('Owner_DB'), tableArn('Franchise_DB')],
}));

export default backend;

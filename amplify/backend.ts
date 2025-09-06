import { defineBackend } from '@aws-amplify/backend';
import {
  Stack, Duration, Aws,
  aws_iam as iam,
  aws_lambda as lambda,
} from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
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
import { deleteFranchiseQuoteTemplateFn } from './functions/delete-franchise-quote-template/resource';
import { deleteFranchiseContractTemplateFn } from './functions/delete-franchise-contract-template/resource'; // NEW
import { getAcceptedQuotesOwnerFn } from './functions/get-quotes-owner-accepted/resource';
import { sendTransferRequestFn } from './functions/owner-send-transfer-request/resource';
import { ownerGetAllMembersFn } from './functions/owner-get-all-members/resource';
import { updateFranchiseInfoFn } from './functions/update-franchise-info/resource';
import { addCboFranchiseFn } from './functions/add-cbo-franchise/resource';
import { ownerInviteCboFn } from './functions/owner-invite-cbo/resource';
import { getJoinRequestFn } from './functions/get-join-request/resource';
import { cboCompleteSignupFn } from './functions/cbo-complete-signup/resource';
import { getCboFn } from './functions/get-cbo/resource';
import { memberAcceptSellRequestFn } from './functions/member-accept-sell-request/resource';
import { buildContractContextFn } from './functions/build-contract-context/resource';
import { updateContractLinksFn } from './functions/update-contract-links/resource';
import { sendContractCreatedEmailFn } from './functions/send-contract-created-email/resource';
import { memberGetAvailableQuotesFn } from './functions/member-get-available-quotes/resource';
import { getPendingSellRequestsFn } from './functions/get-pending-sell-requests/resource';

// TS proxies that call Python validators
import { validateQuoteTemplateProxyFn } from './functions/validate-quote-template-proxy/resource';
import { validateContractTemplateProxyFn } from './functions/validate-contract-template-proxy/resource'; // NEW

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
  getOwnerFn,
  getFranchiseFn,
  getAvailableQuotesOwnerFn,
  ownerAcceptQuoteFn,
  sendQuoteAcceptanceEmailFn,
  setFranchiseTemplateFn,
  validateQuoteTemplateProxyFn,
  validateContractTemplateProxyFn, // NEW
  deleteFranchiseQuoteTemplateFn,
  deleteFranchiseContractTemplateFn, // NEW
  getAcceptedQuotesOwnerFn,
  sendTransferRequestFn,
  ownerGetAllMembersFn,
  updateFranchiseInfoFn,
  addCboFranchiseFn,
  ownerInviteCboFn,
  getJoinRequestFn,
  cboCompleteSignupFn,
  getCboFn,
  memberAcceptSellRequestFn,
  buildContractContextFn,
  updateContractLinksFn,
  sendContractCreatedEmailFn,
  memberGetAvailableQuotesFn,
  getPendingSellRequestsFn,
});

// === Locals ===
const region = Stack.of(backend.data.stack).region;
const account = Aws.ACCOUNT_ID;
const partition = Aws.PARTITION;
const tableArn = (name: string) => `arn:${partition}:dynamodb:${region}:${account}:table/${name}`;
const tableIndexArn = (name: string) => `${tableArn(name)}/index/*`;

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

// 3) Minimal IAM to allow Identity Pool roles to call AppSync
const apiId = backend.data.resources.graphqlApi.apiId;
const appsyncResourceArn = `arn:${partition}:appsync:${region}:${account}:apis/${apiId}/*`;
const appsyncTypesArn = `arn:${partition}:appsync:${region}:${account}:apis/${apiId}/types/*`;

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
    Statement: [{ Effect: 'Allow', Action: 'appsync:GraphQL', Resource: [appsyncResourceArn, appsyncTypesArn] }],
  },
});

// 4) Storage + S3 access
const publicBucket = backend.storage.resources.bucket as s3.Bucket;

// 5) (Optional) deps layer for doc funcs
const docgenDepsLayer = new lambda.LayerVersion(backend.data.stack, 'DocgenDepsLayer', {
  code: lambda.Code.fromAsset('amplify/layers/docgen-deps'),
  compatibleRuntimes: [lambda.Runtime.PYTHON_3_12, lambda.Runtime.PYTHON_3_11],
  description: 'Doc/PDF deps',
});

// Convenience refs for existing functions
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
const setFranchiseTemplateLambda = backend.setFranchiseTemplateFn.resources.lambda as lambda.Function;
const validateQuoteProxy = backend.validateQuoteTemplateProxyFn.resources.lambda as lambda.Function;
const validateContractProxy = backend.validateContractTemplateProxyFn.resources.lambda as lambda.Function; // NEW
const deleteQuoteTplLambda = backend.deleteFranchiseQuoteTemplateFn.resources.lambda as lambda.Function;
const deleteContractTplLambda = backend.deleteFranchiseContractTemplateFn.resources.lambda as lambda.Function; // NEW
const getAcceptedQuotesOwnerLambda = backend.getAcceptedQuotesOwnerFn.resources.lambda as lambda.Function;
const sendTransferRequestLambda = backend.sendTransferRequestFn.resources.lambda as lambda.Function;
const ownerGetAllMembersLambda = backend.ownerGetAllMembersFn.resources.lambda as lambda.Function;
const updateFranchiseLambda = backend.updateFranchiseInfoFn.resources.lambda;
const addCboLambda = backend.addCboFranchiseFn.resources.lambda as lambda.Function;
const inviteFn = backend.ownerInviteCboFn.resources.lambda as lambda.Function;
const getJRFn = backend.getJoinRequestFn.resources.lambda as lambda.Function;
const completeFn = backend.cboCompleteSignupFn.resources.lambda as lambda.Function;
const getCboLambda = backend.getCboFn.resources.lambda as lambda.Function;
const memberAcceptLambda = backend.memberAcceptSellRequestFn.resources.lambda as lambda.Function;
const buildCtxLambda = backend.buildContractContextFn.resources.lambda as lambda.Function;
const updateLinksLambda = backend.updateContractLinksFn.resources.lambda as lambda.Function;
const sendEmail2Lambda = backend.sendContractCreatedEmailFn.resources.lambda as lambda.Function;
const memberGetAvailableQuotesLambda = backend.memberGetAvailableQuotesFn.resources.lambda as lambda.Function;
const getPendingSellRequestsLambda = backend.getPendingSellRequestsFn.resources.lambda as lambda.Function;

// ===== Doc pipeline Lambdas (Python) =====
const buildQuoteDocContextLambda = new lambda.Function(backend.data.stack, 'BuildQuoteDocContextFn', {
  functionName: 'build-quote-doc-context',
  runtime: lambda.Runtime.PYTHON_3_12,
  handler: 'handler.lambda_handler',
  code: lambda.Code.fromAsset('amplify/functions/build-quote-doc-context'),
  timeout: Duration.minutes(2),
  memorySize: 1024,
  layers: [docgenDepsLayer],
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
    OWNER_TABLE: 'Owner_DB',
    FRANCHISE_TABLE: 'Franchise_DB',
    TEMPLATE_BUCKET: publicBucket.bucketName,
    OUTPUT_BUCKET: publicBucket.bucketName,
  },
});

const fillDocxPlaceholdersLambda = new lambda.Function(backend.data.stack, 'FillDocxPlaceholdersFn', {
  functionName: 'fill-docx-placeholders',
  runtime: lambda.Runtime.PYTHON_3_12,
  handler: 'handler.lambda_handler',
  code: lambda.Code.fromAsset('amplify/functions/fill-docx-placeholders'),
  timeout: Duration.minutes(2),
  memorySize: 1024,
  layers: [docgenDepsLayer],
});

const convertDocxToPdfLambda = new lambda.Function(backend.data.stack, 'ConvertDocxToPdfFn', {
  functionName: 'convert-docx-to-pdf',
  runtime: lambda.Runtime.PYTHON_3_12,
  architecture: lambda.Architecture.X86_64,
  handler: 'handler.lambda_handler',
  code: lambda.Code.fromAsset('amplify/functions/convert-docx-to-pdf'),
  timeout: Duration.minutes(3),
  memorySize: 1536,
  layers: [docgenDepsLayer],
  environment: {
    CONTRACT_BUCKET: publicBucket.bucketName, // kept for backward compat in your handler
    ADOBE_SECRET_NAME: 'adobe-credentials',
  },
});

const updateQuoteDocumentLinksLambda = new lambda.Function(backend.data.stack, 'UpdateQuoteDocumentLinksFn', {
  functionName: 'update-quote-document-links',
  runtime: lambda.Runtime.PYTHON_3_12,
  handler: 'handler.lambda_handler',
  code: lambda.Code.fromAsset('amplify/functions/update-quote-document-links'),
  timeout: Duration.minutes(1),
  memorySize: 512,
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
  },
});

// ===== S3 grants =====
publicBucket.grantRead(fillDocxPlaceholdersLambda);
publicBucket.grantWrite(fillDocxPlaceholdersLambda);
publicBucket.grantReadWrite(convertDocxToPdfLambda);
publicBucket.grantRead(sendOwnerAcceptanceEmailLambda);

publicBucket.grantDelete(deleteQuoteTplLambda);
publicBucket.grantRead(deleteQuoteTplLambda);
deleteQuoteTplLambda.addEnvironment('BUCKET_NAME', publicBucket.bucketName);
deleteQuoteTplLambda.addEnvironment('FRANCHISE_TABLE', 'Franchise_DB');

publicBucket.grantDelete(deleteContractTplLambda);
publicBucket.grantRead(deleteContractTplLambda);
deleteContractTplLambda.addEnvironment('BUCKET_NAME', publicBucket.bucketName);
deleteContractTplLambda.addEnvironment('FRANCHISE_TABLE', 'Franchise_DB');

// ===== DynamoDB grants =====
deleteQuoteTplLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:UpdateItem'],
  resources: [tableArn('Franchise_DB')],
}));
deleteContractTplLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:UpdateItem'],
  resources: [tableArn('Franchise_DB')],
}));
buildQuoteDocContextLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:GetItem'],
  resources: [tableArn('CustomerQuotes'), tableArn('Owner_DB'), tableArn('Franchise_DB')],
}));
updateQuoteDocumentLinksLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:UpdateItem'],
  resources: [tableArn('CustomerQuotes')],
}));

getCboLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:GetItem', 'dynamodb:DescribeTable'],
  resources: [tableArn('CBO_DB')],
}));


// Email lambda perms
sendOwnerAcceptanceEmailLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:GetItem'],
  resources: [tableArn('CustomerQuotes'), tableArn('Franchise_DB')],
}));
sendOwnerAcceptanceEmailLambda.addToRolePolicy(new PolicyStatement({
  actions: ['ses:SendRawEmail'],
  resources: ['*'],
}));
sendOwnerAcceptanceEmailLambda.addEnvironment('QUOTE_PDF_BUCKET_NAME', publicBucket.bucketName);

// SecretsManager access for convert lambda
convertDocxToPdfLambda.addToRolePolicy(new PolicyStatement({
  actions: ['secretsmanager:GetSecretValue'],
  resources: [`arn:${partition}:secretsmanager:${region}:${account}:secret:adobe-credentials*`],
}));

buildCtxLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:GetItem', 'dynamodb:DescribeTable'],
  resources: [tableArn('SellRequest_DB'), tableArn('CustomerQuotes'), tableArn('Owner_DB'), tableArn('CBO_DB'), tableArn('Franchise_DB')],
}));

updateLinksLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:UpdateItem'],
  resources: [tableArn('SellRequest_DB'), tableArn('CustomerQuotes')],
}));

sendEmail2Lambda.addToRolePolicy(new PolicyStatement({
  actions: ['ses:SendEmail', 'ses:SendRawEmail'],
  resources: ['*'],
}));


// ===== Existing DDB access kept as-is =====
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
setFranchiseTemplateLambda.addToRolePolicy(new PolicyStatement({
  actions: [
    'dynamodb:GetItem',
    'dynamodb:UpdateItem',
    'dynamodb:PutItem',
    'dynamodb:DescribeTable',
  ],
  resources: [tableArn('Franchise_DB')],
}));
getAcceptedQuotesOwnerLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:Query', 'dynamodb:DescribeTable'],
  resources: [
    tableArn('CustomerQuotes'),
    tableIndexArn('CustomerQuotes'),
    tableArn('SellRequest_DB'),
    tableIndexArn('SellRequest_DB'),
  ],
}));
sendTransferRequestLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:PutItem'],
  resources: [tableArn('SellRequest_DB')],
}));
sendTransferRequestLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:UpdateItem'],
  resources: [tableArn('CustomerQuotes')],
}));
ownerGetAllMembersLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:GetItem', 'dynamodb:DescribeTable'],
  resources: [tableArn('Owner_DB')],
}));
getPendingSellRequestsLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:Query', 'dynamodb:Scan', 'dynamodb:DescribeTable'],
  resources: [tableArn('SellRequest_DB'), tableIndexArn('SellRequest_DB')],
}));

ownerGetAllMembersLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:Scan', 'dynamodb:DescribeTable'],
  resources: [tableArn('CBO_DB')],
}));
updateFranchiseLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:UpdateItem', 'dynamodb:DescribeTable', 'dynamodb:GetItem'],
  resources: [tableArn('Franchise_DB'), tableArn('Owner_DB')],
}));
addCboLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:PutItem', 'dynamodb:DescribeTable'],
  resources: [tableArn('CBO_DB')],
}));
inviteFn.addToRolePolicy(new PolicyStatement({ actions: ['dynamodb:PutItem'], resources: [tableArn('JoinRequest_DB')] }));
getJRFn.addToRolePolicy(new PolicyStatement({ actions: ['dynamodb:GetItem'], resources: [tableArn('JoinRequest_DB')] }));
completeFn.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:GetItem', 'dynamodb:UpdateItem'],
  resources: [tableArn('JoinRequest_DB')],
}));
completeFn.addToRolePolicy(new PolicyStatement({ actions: ['dynamodb:PutItem'], resources: [tableArn('CBO_DB')] }));

// IAM for SES (send invite)
inviteFn.addToRolePolicy(new PolicyStatement({
  actions: ['ses:SendEmail', 'ses:SendRawEmail'],
  resources: ['*'], // or restrict with identities if you have them verified
}));
memberGetAvailableQuotesLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:Query', 'dynamodb:DescribeTable'],
  resources: [
    tableArn('SellRequest_DB'),
    tableIndexArn('SellRequest_DB'), // covers TargetUser-index via /index/*
  ],
}));

memberGetAvailableQuotesLambda.addToRolePolicy(new PolicyStatement({
  actions: ['dynamodb:BatchGetItem', 'dynamodb:GetItem'],
  resources: [tableArn('CustomerQuotes')],
}));
// IAM for Cognito admin (complete signup: lookup and add to group)
const userPoolArn = backend.auth.resources.userPool.userPoolArn;
completeFn.addToRolePolicy(new PolicyStatement({
  actions: ['cognito-idp:AdminGetUser', 'cognito-idp:AdminAddUserToGroup'],
  resources: [userPoolArn],
}));
const BUCKET_NAME = publicBucket.bucketName;
buildCtxLambda.addEnvironment('TEMPLATE_BUCKET', BUCKET_NAME);
buildCtxLambda.addEnvironment('OUTPUT_BUCKET', BUCKET_NAME);
// ===== Step Functions state machine (quote pipeline) =====
const buildContext = new tasks.LambdaInvoke(backend.data.stack, 'BuildContextTask', {
  lambdaFunction: buildQuoteDocContextLambda,
  payload: sfn.TaskInput.fromObject({
    'quoteID.$': '$.quoteID',
    'timezone.$': '$.timezone',
    'requestId.$': '$.requestId'
  }),
  outputPath: '$.Payload',
});

const parseBody = new sfn.Pass(backend.data.stack, 'ParseBuildBody', {
  parameters: { 'ctx.$': 'States.StringToJson($.body)' },
  resultPath: '$.parsed',
  outputPath: '$.parsed.ctx',
});

const fillDocx = new tasks.LambdaInvoke(backend.data.stack, 'FillDocxTask', {
  lambdaFunction: fillDocxPlaceholdersLambda,
  payload: sfn.TaskInput.fromObject({
    'template_bucket.$': '$.template_bucket',
    'template_key.$': '$.template_key',
    'output_bucket.$': '$.output_bucket',
    'docx_key.$': '$.docx_key',
    'placeholders.$': '$.placeholders',
    'blocks.$': '$.blocks',
    'requestId.$': '$.requestId'
  }),
  resultPath: '$.fill',
  payloadResponseOnly: true,
});

const convertPdf = new tasks.LambdaInvoke(backend.data.stack, 'ConvertToPdfTask', {
  lambdaFunction: convertDocxToPdfLambda,
  payload: sfn.TaskInput.fromObject({
    'bucket.$': '$.output_bucket',
    'docx_key.$': '$.docx_key',
    'pdf_key.$': '$.pdf_key',
    'requestId.$': '$.requestId'
  }),
  resultPath: '$.convert',
  payloadResponseOnly: true,
});

const updateLinks = new tasks.LambdaInvoke(backend.data.stack, 'UpdateQuoteLinksTask', {
  lambdaFunction: updateQuoteDocumentLinksLambda,
  payload: sfn.TaskInput.fromObject({
    'quoteID.$': '$.quoteID',
    'bucket.$': '$.output_bucket',
    'pdf_key.$': '$.pdf_key',
    'requestId.$': '$.requestId'
  }),
  resultPath: '$.ddb',
  payloadResponseOnly: true,
});

const sendEmail = new tasks.LambdaInvoke(backend.data.stack, 'SendAcceptanceEmailTask', {
  lambdaFunction: sendOwnerAcceptanceEmailLambda,
  payload: sfn.TaskInput.fromObject({
    body: { 'quoteID.$': '$.quoteID' },
    'requestId.$': '$.requestId'
  }),
  resultPath: '$.email',
  payloadResponseOnly: true,
});

const pipelineDefinition = buildContext
  .next(parseBody)
  .next(fillDocx)
  .next(convertPdf)
  .next(updateLinks)
  .next(sendEmail);

const documentPipeline = new sfn.StateMachine(backend.data.stack, 'QuoteDocumentPipeline', {
  stateMachineName: 'quote-document-pipeline',
  definitionBody: sfn.DefinitionBody.fromChainable(pipelineDefinition),
  timeout: Duration.minutes(5),
});

// tasks
// 1) Build context — make this the working context for the rest of the flow
const buildContractCtx = new tasks.LambdaInvoke(backend.data.stack, 'BuildContractContextTask', {
  lambdaFunction: backend.buildContractContextFn.resources.lambda as lambda.Function,
  payload: sfn.TaskInput.fromObject({
    'sellRequestID.$': '$.sellRequestID', // PK in SellRequest_DB
    'memberCBOID.$': '$.memberCBOID',   // accepting member
    'requestID.$': '$.requestID',     // tracking id (or seed with Pass + JsonPath.uuid())
  }),
  payloadResponseOnly: true,             // return ONLY the Lambda's payload
  // no resultPath here -> this replaces input with a clean context returned by buildContractContext
});

// 2) Fill DOCX — keep original context and nest the result at $.fill
const fillContractDocx = new tasks.LambdaInvoke(backend.data.stack, 'FillContractDocxTask', {
  lambdaFunction: fillDocxPlaceholdersLambda,
  payload: sfn.TaskInput.fromObject({
    'template_bucket.$': '$.template_bucket',
    'template_key.$': '$.template_key',
    'output_bucket.$': '$.output_bucket',
    'docx_key.$': '$.docx_key',
    'placeholders.$': '$.placeholders',
    'blocks.$': '$.blocks',
  }),
  payloadResponseOnly: true,
  resultPath: '$.fill', // <— IMPORTANT: do not clobber the context
});

// 3) Convert to PDF — read from the context you built (ignore fill.body.*)
const convertContractPdf = new tasks.LambdaInvoke(backend.data.stack, 'ConvertContractToPdfTask', {
  lambdaFunction: convertDocxToPdfLambda,
  payload: sfn.TaskInput.fromObject({
    'bucket.$': '$.output_bucket', // <— comes from buildContractContext return
    'docx_key.$': '$.docx_key',
    'pdf_key.$': '$.pdf_key',
  }),
  payloadResponseOnly: true,
  resultPath: '$.convert',
});

// 4) Update DB links — still use the original context values
const updateContractLinks = new tasks.LambdaInvoke(backend.data.stack, 'UpdateContractLinksTask', {
  lambdaFunction: backend.updateContractLinksFn.resources.lambda as lambda.Function,
  payload: sfn.TaskInput.fromObject({
    'quoteID.$': '$.quoteID',
    'requestID.$': '$.requestID',
    'bucket.$': '$.output_bucket',
    'pdf_key.$': '$.pdf_key',
    'sellRequestID.$': '$.sellRequestID',
    'newOwnerID.$':  '$.memberCBOID',
    // optionally add 'sellRequestID.$': '$.sellRequestID'
  }),
  payloadResponseOnly: true,
  resultPath: '$.ddb',
});

// 5) Send email — same pattern
const sendContractEmail = new tasks.LambdaInvoke(backend.data.stack, 'SendContractCreatedEmailTask', {
  lambdaFunction: backend.sendContractCreatedEmailFn.resources.lambda as lambda.Function,
  payload: sfn.TaskInput.fromObject({
    'quoteID.$': '$.quoteID',
    'recipients.$': '$.recipients',
    'bucket.$': '$.output_bucket',
    'pdf_key.$': '$.pdf_key',
    'emailContext.$':  '$.emailContext',
  }),
  payloadResponseOnly: true,
  resultPath: '$.email',
});

// Chain
const memberContractDefinition = buildContractCtx
  .next(fillContractDocx)
  .next(convertContractPdf)
  .next(updateContractLinks)
  .next(sendContractEmail);

publicBucket.grantRead(sendEmail2Lambda);
const memberContractSm = new sfn.StateMachine(backend.data.stack, 'MemberAcceptSellRequestPipeline', {
  stateMachineName: 'member-accept-sell-request-pipeline',
  definitionBody: sfn.DefinitionBody.fromChainable(memberContractDefinition),
  timeout: Duration.minutes(5),
});

// allow the starter lambda to trigger it
memberAcceptLambda.addEnvironment('STATE_MACHINE_ARN', memberContractSm.stateMachineArn);
memberContractSm.grantStartExecution(memberAcceptLambda);


// Owner lambda: env + permission to start the state machine
ownerAcceptQuoteLambda.addEnvironment('DOC_PIPELINE_ARN', documentPipeline.stateMachineArn);
ownerAcceptQuoteLambda.addEnvironment('DEFAULT_TIMEZONE', 'America/Chicago');
documentPipeline.grantStartExecution(ownerAcceptQuoteLambda);
// ===== Template validation: Python validators + Node proxies =====
const validateQuoteTemplateLambda = new lambda.Function(backend.data.stack, 'ValidateQuoteTemplateFn', {
  functionName: 'validate-quote-template',
  runtime: lambda.Runtime.PYTHON_3_12,
  handler: 'handler.lambda_handler',
  code: lambda.Code.fromAsset('amplify/functions/validate-quote-template'),
  timeout: Duration.minutes(2),
  memorySize: 1024,
  environment: {
    TEMPLATE_BUCKET: publicBucket.bucketName,
    OUTPUT_BUCKET: publicBucket.bucketName,
    FILL_LAMBDA_NAME: fillDocxPlaceholdersLambda.functionName,
    CONVERT_LAMBDA_NAME: convertDocxToPdfLambda.functionName,
  },
});

const validateContractTemplateLambda = new lambda.Function(backend.data.stack, 'ValidateContractTemplateFn', {
  functionName: 'validate-contract-template',
  runtime: lambda.Runtime.PYTHON_3_12,
  handler: 'handler.lambda_handler',
  code: lambda.Code.fromAsset('amplify/functions/validate-contract-template'), // NEW folder
  timeout: Duration.minutes(2),
  memorySize: 1024,
  environment: {
    TEMPLATE_BUCKET: publicBucket.bucketName,
    OUTPUT_BUCKET: publicBucket.bucketName,
    FILL_LAMBDA_NAME: fillDocxPlaceholdersLambda.functionName,
    CONVERT_LAMBDA_NAME: convertDocxToPdfLambda.functionName,
  },
});

// proxies → python
validateQuoteProxy.addEnvironment('TARGET_FUNCTION_NAME', validateQuoteTemplateLambda.functionName);
validateContractProxy.addEnvironment('TARGET_FUNCTION_NAME', validateContractTemplateLambda.functionName);

validateQuoteTemplateLambda.grantInvoke(validateQuoteProxy);
validateContractTemplateLambda.grantInvoke(validateContractProxy);

// python → S3 and invoke helpers
publicBucket.grantReadWrite(validateQuoteTemplateLambda);
publicBucket.grantReadWrite(validateContractTemplateLambda);
fillDocxPlaceholdersLambda.grantInvoke(validateQuoteTemplateLambda);
fillDocxPlaceholdersLambda.grantInvoke(validateContractTemplateLambda);
convertDocxToPdfLambda.grantInvoke(validateQuoteTemplateLambda);
convertDocxToPdfLambda.grantInvoke(validateContractTemplateLambda);

addCboLambda.addEnvironment('USER_POOL_ID', backend.auth.resources.userPool.userPoolId);
completeFn.addEnvironment('USER_POOL_ID', backend.auth.resources.userPool.userPoolId);

addCboLambda.addToRolePolicy(new PolicyStatement({
  actions: [
    'cognito-idp:AdminCreateUser',
    'cognito-idp:AdminSetUserPassword',
    'cognito-idp:AdminAddUserToGroup',
    'cognito-idp:AdminUpdateUserAttributes',
  ],
  resources: [userPoolArn],
}));
// Auth trigger policies
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
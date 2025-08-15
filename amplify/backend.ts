// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { Stack, Aws, aws_iam as iam, aws_lambda as lambda } from 'aws-cdk-lib';
import { postConfirmation } from './auth/post-sign-up-confirmation/resource';

// ✅ Use stable CDK packages (no -alpha)
import {
  HttpApi,
  HttpMethod,
  CorsHttpMethod,
} from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { HttpUserPoolAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';

import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

// Your function factories (created via defineFunction provider form)
import { createOwnerFn } from './functions/create-owner/resource';
import { createFranchiseFn } from './functions/create-franchise/resource';
import { createCboFn } from './functions/create-cbo/resource';

// 1) Bind everything to the backend (gives .resources for each fn)
const backend = defineBackend({
  auth,
  data,
  storage,
  createOwnerFn,
  createFranchiseFn,
  createCboFn,
  postConfirmation,
});

// after: const backend = defineBackend({...})
const { cfnUserPool } = backend.auth.resources.cfnResources;

// ✅ Keep the attribute the pool already has. Do not remove or change it later.
const existing = Array.isArray(cfnUserPool.schema) ? [...cfnUserPool.schema] : [];
let modified = false;

const addCustomStringAttr = (name: string) => {
  if (!existing.some((a: any) => a?.name === name)) {
    existing.push({
      name,
      attributeDataType: 'String',
      mutable: true,
      required: false, // enforce 'required' in PreSignUp, not here
      stringAttributeConstraints: { minLength: '1', maxLength: '50' },
    });
    modified = true;
  }
};

addCustomStringAttr('role');
addCustomStringAttr('FranchiseID');

// Only assign if we actually appended (avoids accidental “modify” ops)
if (modified) cfnUserPool.schema = existing;

// (You can also keep your password policy)
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 12,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
  },
};


const httpApi = new HttpApi(backend.stack, 'AppHttpApi', {
  corsPreflight: {
    allowOrigins: ['http://localhost:3000', 'https://bid2clean.com'],
    allowHeaders: ['Authorization', 'Content-Type'],
    allowMethods: [CorsHttpMethod.ANY],
  },
});


// 4) Cognito authorizer from the new pool (stable module)
const authorizer = new HttpUserPoolAuthorizer(
  'CognitoAuthorizer',
  backend.auth.resources.userPool,
  { userPoolClients: [backend.auth.resources.userPoolClient] }
);

// 5) Route registry — strongly type as lambda.Function so addEnvironment/etc. exist
type Route = {
  path: string;
  method: HttpMethod;
  lambda: lambda.Function; // NodejsFunction extends this; cast below
  auth?: boolean;          // default true
  name?: string;
};

const routes: Route[] = [
  {
    path: '/owner',
    method: HttpMethod.POST,
    lambda: backend.createOwnerFn.resources.lambda as lambda.Function,
  },
  {
    path: '/franchise',
    method: HttpMethod.POST,
    lambda: backend.createFranchiseFn.resources.lambda as lambda.Function,
  },
  {
    path: '/cbo',
    method: HttpMethod.POST,
    lambda: backend.createCboFn.resources.lambda as lambda.Function,
  },
];

// 6) Wire routes to the API
for (const r of routes) {
  httpApi.addRoutes({
    path: r.path,
    methods: [r.method],
    authorizer: r.auth === false ? undefined : authorizer,
    integration: new HttpLambdaIntegration(
      r.name ?? `Int-${r.path.replace(/\W+/g, '-')}-${r.method}`,
      r.lambda
    ),
  });
}

// 7) IAM permissions (region/account aware)
const region = Stack.of(httpApi).region;
const account = Aws.ACCOUNT_ID;
//const userPoolArn = backend.auth.resources.userPool.userPoolArn;

// Convenience refs (already cast above)
const ownerFn = backend.createOwnerFn.resources.lambda as lambda.Function;
const franchiseFn = backend.createFranchiseFn.resources.lambda as lambda.Function;
const cboFn = backend.createCboFn.resources.lambda as lambda.Function;
const postConfFn = backend.postConfirmation.resources.lambda as lambda.Function;

const userPoolWildcardArn = `arn:${Aws.PARTITION}:cognito-idp:${region}:${account}:userpool/*`;

postConfFn.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['cognito-idp:AdminAddUserToGroup'],
    resources: [userPoolWildcardArn], // ⬅️ no hard ref to the CFN user pool
  })
);

// Keep DDB write permission (this doesn't cause a cycle)
postConfFn.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['dynamodb:PutItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/Owner_DB`],
  })
);

postConfFn.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['dynamodb:PutItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/Franchise_DB`],
  })
);

// create-cbo: Cognito admin + read Owner_DB + write CBO_DB + S3 read
cboFn.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['cognito-idp:AdminCreateUser', 'cognito-idp:AdminSetUserPassword'],
    resources: [userPoolWildcardArn],
  })
);
cboFn.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['dynamodb:GetItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/Owner_DB`],
  })
);
cboFn.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['dynamodb:PutItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/CBO_DB`],
  })
);
cboFn.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['s3:GetObject'],
    resources: ['arn:aws:s3:::cbo-pic-storage/*'],
  })
);

// create-owner: write Owner_DB + read default image
ownerFn.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['dynamodb:PutItem', 'dynamodb:UpdateItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/Owner_DB`],
  })
);
ownerFn.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['s3:GetObject'],
    resources: ['arn:aws:s3:::cbo-pic-storage/*'],
  })
);

// create-franchise: write Franchise_DB
franchiseFn.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['dynamodb:PutItem'],
    resources: [`arn:aws:dynamodb:${region}:${account}:table/Franchise_DB`],
  })
);

// 8) Example dynamic env var
cboFn.addEnvironment('USER_POOL_ID', backend.auth.resources.userPool.userPoolId);




// 10) Output the API URL for the frontend
backend.addOutput({
  custom: {
    apiUrl: httpApi.apiEndpoint,
    region,
  },
});

export default backend;

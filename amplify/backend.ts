// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { Stack, Aws, aws_iam as iam, aws_lambda as lambda } from 'aws-cdk-lib';

// ✅ Use stable CDK packages
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

// 1) Bind everything to the backend (gives you .resources for each fn)
const backend = defineBackend({
  auth,
  data,
  storage,
  createOwnerFn,
  createFranchiseFn,
  createCboFn,
});

// 2) Put the API on its own stack
const apiStack = backend.createStack('http-api');

// 3) HttpApi with CORS
const httpApi = new HttpApi(apiStack, 'AppHttpApi', {
  corsPreflight: {
    allowOrigins: [
      'http://localhost:3000',
      // 'https://yourdomain.com', // add prod domains
    ],
    allowHeaders: ['Authorization', 'Content-Type'],
    allowMethods: [CorsHttpMethod.ANY],
  },
});

// 4) Cognito authorizer from the NEW pool
const authorizer = new HttpUserPoolAuthorizer(
  'CognitoAuthorizer',
  backend.auth.resources.userPool,
  { userPoolClients: [backend.auth.resources.userPoolClient] }
);

// 5) Route registry — type as lambda.Function so addEnvironment etc. are available
type Route = {
  path: string;
  method: HttpMethod;
  lambda: lambda.Function; // concrete type, still satisfies IFunction where needed
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

// 6) Wire routes
for (const r of routes) {
  httpApi.addRoutes({
    path: r.path,
    methods: [r.method],
    authorizer: r.auth === false ? undefined : authorizer,
    integration: new HttpLambdaIntegration(
      r.name ?? `Int-${r.path.replace(/\W+/g, '-')}-${r.method}`,
      r.lambda // Function implements IFunction
    ),
  });
}

// 7) IAM permissions (centralized, region/account aware)
const region = Stack.of(httpApi).region;
const account = Aws.ACCOUNT_ID;
const userPoolArn = backend.auth.resources.userPool.userPoolArn;

// Helpers to avoid repeating casts
const ownerFn = backend.createOwnerFn.resources.lambda as lambda.Function;
const franchiseFn = backend.createFranchiseFn.resources.lambda as lambda.Function;
const cboFn = backend.createCboFn.resources.lambda as lambda.Function;

// create-cbo: Cognito admin + read Owner_DB + write CBO_DB + S3 read
cboFn.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['cognito-idp:AdminCreateUser', 'cognito-idp:AdminSetUserPassword'],
    resources: [userPoolArn],
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

// 8) Dynamic env (now valid because we have lambda.Function)
cboFn.addEnvironment('USER_POOL_ID', backend.auth.resources.userPool.userPoolId);

// 9) Password policy tweak
const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 12,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
  },
};

// 10) Output the API URL for the frontend
backend.addOutput({
  custom: {
    apiUrl: httpApi.apiEndpoint,
    region,
  },
});

export default backend;

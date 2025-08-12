import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';

// Map URL routes to function export names (from each resource.ts)
export const routes = [
  { path: '/cbo',    method: HttpMethod.POST, fnExport: 'createCboFn', protected: true },
  // { path: '/owner',  method: HttpMethod.POST, fnExport: 'createOwnerFn', protected: true },
  // add more here...
];

// IAM needs per function (keep least-privilege!)
export const iamNeeds: Record<string, { actions: string[], resources: (region: string, account: string) => string[] }[]> = {
  createCboFn: [
    {
      actions: ['cognito-idp:AdminCreateUser','cognito-idp:AdminSetUserPassword'],
      resources: (_r,_a) => ['*'], // or the specific pool ARN set in backend.ts
    },
    {
      actions: ['dynamodb:GetItem'],
      resources: (r,a) => [`arn:aws:dynamodb:${r}:${a}:table/Owner_DB`],
    },
    {
      actions: ['dynamodb:PutItem'],
      resources: (r,a) => [`arn:aws:dynamodb:${r}:${a}:table/CBO_DB`],
    },
    {
      actions: ['s3:GetObject'],
      resources: (_r,_a) => ['arn:aws:s3:::cbo-pic-storage/*'],
    },
  ],
  // add blocks per fnExport
};

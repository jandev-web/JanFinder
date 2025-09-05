// amplify/functions/cbo-complete-signup/handler.ts
import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
  AdminGetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import crypto from 'crypto';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), { marshallOptions: { removeUndefinedValues: true }});
const cognito = new CognitoIdentityProviderClient({});

const CBO_TABLE = process.env.CBO_TABLE!;
const USER_POOL_ID = process.env.USER_POOL_ID!;
const MEMBERS_GROUP = process.env.MEMBERS_GROUP || 'Member';
const SECRET = process.env.INVITE_HMAC_SECRET!;

const b64urlToBuf = (s: string) => Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
const b64url = (buf: Buffer) => buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
const sign = (payload: string) => b64url(crypto.createHmac('sha256', SECRET).update(payload).digest());

type Args = {
  token: string;
  firstName: string; lastName: string; phone?: string;
  street?: string; city?: string; state?: string; postalCode?: string; country?: string;
};

export const handler: Handler = async (event) => {
  const args = (event?.arguments ?? {}) as Args;
  const token = (args.token || '').trim();
  if (!token || !args.firstName || !args.lastName) {
    return { statusCode: 400, body: JSON.stringify({ ok:false, message:'Missing input' }) };
  }

  // Verify token
  const [payloadPart, sig] = token.split('.');
  if (!payloadPart || !sig) {
    return { statusCode: 400, body: JSON.stringify({ ok:false, message:'Bad token' }) };
  }
  const expected = sign(payloadPart);
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return { statusCode: 403, body: JSON.stringify({ ok:false, message:'Invalid token' }) };
  }

  const payloadJson = b64urlToBuf(payloadPart).toString('utf8');
  const payload = JSON.parse(payloadJson) as { email: string; franchiseID: string; iat: number; exp: number };
  const now = Math.floor(Date.now() / 1000);
  if (!payload?.email || !payload?.franchiseID || now >= Number(payload.exp)) {
    return { statusCode: 400, body: JSON.stringify({ ok:false, message:'Expired or malformed token' }) };
    }

  // Auth identity (Cognito User Pools)
  const identity = (event as any)?.identity || {};
  const username =
    identity?.username ||
    identity?.claims?.['cognito:username'] ||
    identity?.claims?.['username'];

  const sub =
    identity?.sub ||
    identity?.claims?.['sub'];

  if (!username || !sub) {
    return { statusCode: 401, body: JSON.stringify({ ok:false, message:'Not signed in' }) };
  }

  // Confirm the signed-in user's email matches token.email
  const user = await cognito.send(new AdminGetUserCommand({
    UserPoolId: USER_POOL_ID,
    Username: username,
  })).catch(() => null);

  const emailAttr = user?.UserAttributes?.find(a => a.Name === 'email')?.Value?.toLowerCase();
  if (!emailAttr || emailAttr !== payload.email.toLowerCase()) {
    return { statusCode: 403, body: JSON.stringify({ ok:false, message:'Email mismatch' }) };
  }

  // Add to members group (idempotent)
  await cognito.send(new AdminAddUserToGroupCommand({
    UserPoolId: USER_POOL_ID,
    Username: username,
    GroupName: MEMBERS_GROUP,
  }));

  // Write to CBO_DB (CBOID = sub)
  const nowIso = new Date().toISOString();
  await ddb.send(new PutCommand({
    TableName: CBO_TABLE,
    Item: {
      CBOID: sub,
      FranchiseID: payload.franchiseID,
      FirstName: args.firstName,
      LastName: args.lastName,
      Email: emailAttr,
      Phone: args.phone || null,
      Address: { street: args.street, city: args.city, state: args.state, postalCode: args.postalCode, country: args.country },
      CreatedOn: nowIso,
      HasProfilePic: false,
      Status: 'ACTIVE',
      Source: 'self-signup',
    },
    ConditionExpression: 'attribute_not_exists(CBOID)',
  })).catch((e) => {
    if (e?.name !== 'ConditionalCheckFailedException') throw e;
  });

  return { statusCode: 200, body: JSON.stringify({ ok:true, CBOID: sub }) };
};

import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AttributeType,
} from '@aws-sdk/client-cognito-identity-provider';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const cognito = new CognitoIdentityProviderClient({});

const CBO_TABLE = process.env.CBO_TABLE_NAME ?? 'CBO_DB';
const OWNER_TABLE = process.env.OWNER_TABLE_NAME ?? 'Owner_DB';
const S3_BUCKET = process.env.S3_BUCKET ?? 'cbo-pic-storage';
const USER_POOL_ID = process.env.USER_POOL_ID; // set in backend.ts

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  // CORS preflight
  if (event.requestContext.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers: CORS };
  }

  try {
    if (!event.body) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing request body' }) };
    }

    const body = JSON.parse(event.body);
    const cboData = body?.cboData;
    if (!cboData) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Missing 'cboData' in request body" }) };
    }

    const email: string | undefined = cboData.email;
    const phone: string | undefined = cboData.phone;
    const firstName: string | undefined = cboData.firstName;
    const lastName: string | undefined = cboData.lastName;
    const ownerID: string | undefined = cboData.ownerID;
    const address = cboData.address;
    const password = 'Password1!'; // same as your python default
    const timestamp = new Date().toISOString();

    if (!email || !firstName || !lastName || !ownerID) {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: 'Email, first name, last name, and owner ID are required.' }),
      };
    }

    // ----- Look up owner to get franchiseID -----
    const ownerRes = await ddb.send(
      new GetCommand({ TableName: OWNER_TABLE, Key: { OwnerID: ownerID } })
    );
    if (!ownerRes.Item) {
      return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'Owner not found' }) };
    }
    const franchiseID = ownerRes.Item.franchiseID;
    if (!franchiseID) {
      return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'Franchise ID not found for the owner' }) };
    }

    if (!USER_POOL_ID) {
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'USER_POOL_ID not configured' }) };
    }

    // ----- Create Cognito user (admin) -----
    const createRes = await cognito.send(
      new AdminCreateUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        UserAttributes: [{ Name: 'email', Value: email }] as AttributeType[],
        TemporaryPassword: password,
        ForceAliasCreation: true,
        DesiredDeliveryMediums: ['EMAIL'],
        MessageAction: 'SUPPRESS', // optional: suppress auto-email if you send your own
      })
    );

    // The sub is typically in the returned User attributes; fallback to Username/email
    const attrs = (createRes.User?.Attributes ?? []) as AttributeType[];
    const sub = attrs.find(a => a.Name === 'sub')?.Value;
    const cognitoUserId = sub || createRes.User?.Username || email;

    // Set temp password (not permanent, as your python version did)
    await cognito.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        Password: password,
        Permanent: false,
      })
    );

    // ----- Insert CBO record -----
    const imageUrl = `https://${S3_BUCKET}.s3.amazonaws.com/defaultProfilePic.jpg`;
    const item = {
      CBOID: cognitoUserId,
      franchiseID,
      email,
      firstName,
      lastName,
      address,
      phone,
      profilePic: imageUrl,
      subscription: {
        subName: 'None',
        subLevel: 'None',
        subType: 'None',
        subCost: 0,
        subServices: [],
        has: false,
        startData: 'None',
        frequency: 'None',
        nextChargeDate: 'None',
        type: 'None',
      },
      createdOn: timestamp,
    };

    await ddb.send(new PutCommand({ TableName: CBO_TABLE, Item: item }));

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        message: `CBO account created successfully for ${email}.`,
        CBOID: cognitoUserId,
      }),
    };
  } catch (err: any) {
    console.error('create-cbo error:', err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: String(err?.message || 'Unknown error') }),
    };
  }
};

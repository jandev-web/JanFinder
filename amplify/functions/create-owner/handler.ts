// handler.ts
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';

const TABLE_NAME = process.env.OWNER_TABLE ?? 'Owner_DB';
const S3_BUCKET  = process.env.S3_BUCKET  ?? 'cbo-pic-storage';
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? '*';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const OwnerDataSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  firstSignIn: z.boolean().optional(),
}).passthrough(); // allow extra keys

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  };
}

function parseBody(event: APIGatewayProxyEventV2) {
  if (!event.body) return {};
  try {
    return typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch {
    return {};
  }
}

function getClaims(event: APIGatewayProxyEventV2) {
  // API Gateway HTTP API (JWT authorizer) shape
  return (event.requestContext as any)?.authorizer?.jwt?.claims ?? {};
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  if (event.requestContext.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders() };
  }

  try {
    const now = new Date().toISOString();
    const body = parseBody(event);
    const ownerDataInput = body.ownerData ?? body;
    const ownerData = OwnerDataSchema.safeParse(ownerDataInput).success
      ? ownerDataInput
      : {};

    const claims = getClaims(event);
    if (!claims) {
      return { statusCode: 401, headers: corsHeaders(), body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const sub      = claims.sub as string | undefined;
    const email    = claims.email as string | undefined;
    const given    = claims.given_name as string | undefined;
    const family   = claims.family_name as string | undefined;
    const phoneJWT = claims.phone_number as string | undefined;

    const firstName   = (ownerData.firstName ?? given ?? '').trim();
    const lastName    = (ownerData.lastName  ?? family ?? '').trim();
    const phone       = (ownerData.phone     ?? phoneJWT ?? '').trim();
    const firstSignIn = Boolean(ownerData.firstSignIn ?? false);

    if (!sub || !email || !firstName || !lastName) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Missing required identity/profile fields.' }),
      };
    }

    // Idempotency: if Owner already exists, return success
    const existing = await ddb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { OwnerID: sub },
    }));

    if (existing.Item) {
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({ message: 'Owner exists', ownerID: sub, item: existing.Item }),
      };
    }

    const item = {
      OwnerID: sub,
      email,
      firstName,
      lastName,
      phone,
      address: null,
      profilePic: `https://${S3_BUCKET}.s3.amazonaws.com/defaultProfilePic.jpg`,
      firstSignIn,
      createdOn: now,
    };

    await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Owner created', ownerID: sub }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: String(err?.message ?? err) }),
    };
  }
};

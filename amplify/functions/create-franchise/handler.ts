// amplify/functions/create-franchise/handler.ts
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.FRANCHISE_TABLE ?? 'Franchise_DB';

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
    // Parse body
    const body = event.body ? JSON.parse(event.body) : {};
    const franchiseName: string | undefined = body.franchiseName;
    const serviceRegions = body.serviceRegions;

    // Validate
    if (!franchiseName) {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: 'Franchise name is required.' }),
      };
    }

    // Generate IDs
    const franchiseID = crypto.randomUUID();
    const franchiseAccountNumber = crypto.randomUUID();

    // Put item
    await ddb.send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          FranchiseID: franchiseID,
          franchiseName,
          contractTemplate: 'none',
          quoteTemplate: 'none',
          FranchiseAccountNumber: franchiseAccountNumber,
          serviceRegions, // whatever structure you pass from the client
        },
      })
    );

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        message: 'Franchise account created successfully',
        franchiseID,
        FranchiseAccountNumber: franchiseAccountNumber,
      }),
    };
  } catch (err: any) {
    console.error('create-franchise error:', err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'General Error: ' + (err?.message ?? 'Unknown') }),
    };
  }
};

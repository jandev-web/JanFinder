import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

// Builds a dynamic SET update so we only send provided fields
function buildUpdateExpression(input: {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  address?: Record<string, any>;
}) {
  const updates: string[] = [];
  const values: Record<string, any> = {};

  const setBoth = (field: keyof typeof input, key: string) => {
    const v = input[field];
    if (v !== undefined) {
      updates.push(`${key} = :${key.replace(/[.\[\]]/g, '_')}`);
      values[`:${key.replace(/[.\[\]]/g, '_')}`] = v;
    }
  };

  // top-level email and mirrored fields under customerData
  if (input.email !== undefined) {
    updates.push(`email = :email`);
    values[`:email`] = input.email;
    updates.push(`customerData.email = :c_email`);
    values[`:c_email`] = input.email;
  }
  setBoth('firstName', 'customerData.firstName');
  setBoth('lastName',  'customerData.lastName');
  setBoth('phone',     'customerData.phone');
  setBoth('company',   'customerData.company');

  if (input.address !== undefined) {
    updates.push(`customerData.address = :c_address`);
    values[`:c_address`] = input.address;
  }

  if (updates.length === 0) return null;
  return { UpdateExpression: `SET ${updates.join(', ')}`, ExpressionAttributeValues: values };
}

export const handler: Handler = async (event: any) => {
  try {
    // Accept Amplify Data (event.arguments) or REST (event.body)
    let quoteID: string | undefined;
    let customerInfo:
      | {
          email?: string;
          firstName?: string;
          lastName?: string;
          phone?: string;
          company?: string;
          address?: Record<string, any>;
        }
      | undefined;

    if (event?.arguments) {
      // Amplify Data
      quoteID = event.arguments.quoteID ?? event.arguments?.payload?.quoteID;
      customerInfo = event.arguments.customerInfo ?? event.arguments?.payload?.customerInfo;
    } else if (event?.body) {
      // REST
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      quoteID = body?.quoteID;
      customerInfo = body?.customerInfo;
    }

    if (!quoteID || !customerInfo) {
      return respond(event, 400, { message: 'Missing required fields: quoteID or customerInfo' });
    }

    const built = buildUpdateExpression(customerInfo);
    if (!built) {
      return respond(event, 400, { message: 'No updatable fields provided in customerInfo' });
    }

    const result = await ddbDoc.send(
      new UpdateCommand({
        TableName: QUOTES,
        Key: { QuoteID: String(quoteID) },
        ...built,
        ReturnValues: 'UPDATED_NEW',
      })
    );

    return respond(event, 200, {
      message: 'Quote updated successfully',
      updatedAttributes: result.Attributes ?? {},
    });
  } catch (e: any) {
    console.error('Error updating quote:', e);
    return respond(event, 500, { message: 'Error updating quote', error: e?.message ?? String(e) });
  }
};

// Unify REST vs Amplify Data responses
function respond(event: any, statusCode: number, payload: any) {
  // REST (API Gateway HTTP)
  if (event?.requestContext?.http) {
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(payload),
    };
  }
  // Amplify Data
  if (statusCode >= 400) throw new Error(payload?.message || 'Error');
  return payload;
}

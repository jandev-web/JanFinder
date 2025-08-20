// amplify/functions/update-customer-info/handler.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

type CustomerInfo = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  address?: Record<string, any>;
};

function buildUpdateExpression(input: CustomerInfo) {
  const updates: string[] = [];
  const values: Record<string, any> = {};
  const names: Record<string, string> = {
    '#cd': 'customerData',
    '#email': 'email',
    '#firstName': 'firstName',
    '#lastName': 'lastName',
    '#phone': 'phone',
    '#company': 'company',
    '#address': 'address',
  };

  const setNested = (val: unknown, tokenPath: string, valueKey: string) => {
    if (val === undefined) return;
    updates.push(`${tokenPath} = :${valueKey}`);
    values[`:${valueKey}`] = val;
  };

  // top-level email + mirror into customerData
  if (input.email !== undefined) {
    updates.push('#email = :email');
    values[':email'] = input.email;

    updates.push('#cd.#email = :c_email');
    values[':c_email'] = input.email;
  }

  setNested(input.firstName, '#cd.#firstName', 'cd_firstName');
  setNested(input.lastName,  '#cd.#lastName',  'cd_lastName');
  setNested(input.phone,     '#cd.#phone',     'cd_phone');
  setNested(input.company,   '#cd.#company',   'cd_company');
  setNested(input.address,   '#cd.#address',   'cd_address');

  if (!updates.length) return null;

  return {
    UpdateExpression: `SET ${updates.join(', ')}`,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
  };
}

export const handler: Schema['updateCustomerInfo']['functionHandler'] = async (event) => {
  const quoteID = event.arguments?.quoteID as string | undefined;

  // AppSync may send AWSJSON as a JS object or a JSON string
  const rawInfo = event.arguments?.customerInfo as unknown;
  const customerInfo: CustomerInfo =
    typeof rawInfo === 'string' ? JSON.parse(rawInfo) : (rawInfo ?? {});

  if (!quoteID) throw new Error('quoteID is required');
  if (!customerInfo || typeof customerInfo !== 'object') {
    throw new Error('customerInfo is required and must be an object');
  }

  const built = buildUpdateExpression(customerInfo);
  if (!built) return { message: 'No changes' };

  await ddbDoc.send(
    new UpdateCommand({
      TableName: QUOTES,
      Key: { QuoteID: String(quoteID) },
      ...built,
      ReturnValues: 'NONE',
    })
  );

  return { message: 'OK' };
};

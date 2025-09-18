// amplify/functions/update-customer-info/handler.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';

type CustomerInfo = Partial<{
  email: string; // top-level, mirrored to customerData.email
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  address: Partial<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
}>;

const trimNonEmpty = (v?: unknown) => {
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  return s.length ? s : undefined;
};

function buildSetOnlyUpdate(input: CustomerInfo) {
  const setParts: string[] = [];
  const names: Record<string, string> = {
    '#cd': 'customerData',
    '#email': 'email',
    '#firstName': 'firstName',
    '#lastName': 'lastName',
    '#phone': 'phone',
    '#company': 'company',
    '#address': 'address',
    '#street': 'street',
    '#city': 'city',
    '#state': 'state',
    '#postalCode': 'postalCode',
    '#country': 'country',
    '#updatedAt': 'updatedAt',
  };
  const values: Record<string, any> = {
    ':now': new Date().toISOString(),
  };

  const pushSet = (tokenPath: string, valueKey: string, val: unknown) => {
    if (val === undefined) return;
    setParts.push(`${tokenPath} = :${valueKey}`);
    values[`:${valueKey}`] = val;
  };

  // email (GSI key): only set when non-empty
  if ('email' in input) {
    const clean = trimNonEmpty(input.email)?.toLowerCase();
    if (clean) {
      pushSet('#email', 'email', clean);
      pushSet('#cd.#email', 'c_email', clean);
    }
    // If empty string is passed, we skip setting (no clears).
  }

  // simple customerData fields — set when provided and non-empty
  if ('firstName' in input) {
    const v = trimNonEmpty(input.firstName);
    if (v) pushSet('#cd.#firstName', 'cd_firstName', v);
  }
  if ('lastName' in input) {
    const v = trimNonEmpty(input.lastName);
    if (v) pushSet('#cd.#lastName', 'cd_lastName', v);
  }
  if ('phone' in input) {
    const v = trimNonEmpty(input.phone);
    if (v) pushSet('#cd.#phone', 'cd_phone', v);
  }
  if ('company' in input) {
    const v = trimNonEmpty(input.company);
    if (v) pushSet('#cd.#company', 'cd_company', v);
  }

  // address: merge field-by-field; only set non-empty fields
  if (input.address) {
    const { street, city, state, postalCode, country } = input.address;

    const st = trimNonEmpty(street);
    if (st) pushSet('#cd.#address.#street', 'addr_street', st);

    const ct = trimNonEmpty(city);
    if (ct) pushSet('#cd.#address.#city', 'addr_city', ct);

    const stt = trimNonEmpty(state)?.toUpperCase();
    if (stt) pushSet('#cd.#address.#state', 'addr_state', stt);

    const pc = trimNonEmpty(postalCode);
    if (pc) pushSet('#cd.#address.#postalCode', 'addr_postal', pc);

    const ctry = trimNonEmpty(country);
    if (ctry) pushSet('#cd.#address.#country', 'addr_country', ctry);
  }

  // always stamp updatedAt if we are changing anything
  if (setParts.length) {
    setParts.push('#updatedAt = :now');
  }

  if (!setParts.length) return null;

  return {
    UpdateExpression: `SET ${setParts.join(', ')}`,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
  };
}

export const handler: Schema['updateCustomerInfo']['functionHandler'] = async (event) => {
  const quoteID = event.arguments?.quoteID as string | undefined;

  const rawInfo = event.arguments?.customerInfo as unknown;
  const customerInfo: CustomerInfo =
    typeof rawInfo === 'string' ? JSON.parse(rawInfo) : (rawInfo ?? {});

  if (!quoteID) throw new Error('quoteID is required');
  if (!customerInfo || typeof customerInfo !== 'object') {
    throw new Error('customerInfo is required and must be an object');
  }

  const ops = buildSetOnlyUpdate(customerInfo);
  if (!ops) return { message: 'No changes' };

  await ddbDoc.send(new UpdateCommand({
    TableName: QUOTES,
    Key: { QuoteID: String(quoteID) },            // PK you’re keeping
    ...ops,
    ConditionExpression: 'attribute_exists(QuoteID)', // optional safety
    ReturnValues: 'NONE',
  }));

  return { message: 'OK' };
};


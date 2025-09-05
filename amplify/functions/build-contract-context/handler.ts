// amplify/functions/build-contract-context/index.ts (or .mjs)
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

export const handler = async (event: any) => {
  try {
    const { sellRequestID, requestID, memberCBOID } = event || {};
    if (!sellRequestID || !memberCBOID) {
      throw new Error('Missing sellRequestID/memberCBOID');
    }

    const SELL_REQUEST_TABLE   = process.env.SELL_REQUEST_TABLE!;
    const CUSTOMER_QUOTES_TABLE= process.env.CUSTOMER_QUOTES_TABLE!;
    const OWNER_TABLE          = process.env.OWNER_TABLE!;
    const CBO_TABLE            = process.env.CBO_TABLE!;
    const FRANCHISE_TABLE      = process.env.FRANCHISE_TABLE!;
    const TEMPLATE_BUCKET      = process.env.TEMPLATE_BUCKET!;
    const OUTPUT_BUCKET        = process.env.OUTPUT_BUCKET!;

    // --- Load Sell Request by DB PK (assumed attribute name "RequestID") ---
    const reqRes = await ddb.send(new GetCommand({
      TableName: SELL_REQUEST_TABLE,
      Key: { RequestID: sellRequestID },     // ← use sellRequestID here
    }));
    const req = reqRes.Item;
    if (!req) throw new Error('Sell request not found');

    const quoteID = req.QuoteID;
    const ownerID = req.FromOwnerID;

    // --- Load related records ---
    const quoteRes = await ddb.send(new GetCommand({ TableName: CUSTOMER_QUOTES_TABLE, Key: { QuoteID: quoteID } }));
    const quote = quoteRes.Item ?? {};

    const ownerRes = await ddb.send(new GetCommand({ TableName: OWNER_TABLE, Key: { OwnerID: ownerID } }));
    const owner = ownerRes.Item ?? {};

    const memberRes = await ddb.send(new GetCommand({ TableName: CBO_TABLE, Key: { CBOID: memberCBOID } }));
    const member = memberRes.Item ?? {};

    const franchiseID = owner.franchiseID || owner.FranchiseID;
    const franRes = await ddb.send(new GetCommand({ TableName: FRANCHISE_TABLE, Key: { FranchiseID: franchiseID } }));
    const franchise = franRes.Item ?? {};

    // --- Template location (same bucket, franchise path) ---
    const template_bucket = TEMPLATE_BUCKET;
    const template_key =
      franchise.contractTemplateKey
      ?? `members/franchise/${franchiseID}/templates/contract/contract-template.docx`;

    // --- Output keys (use requestID for uniqueness if present) ---
    const output_bucket = OUTPUT_BUCKET;
    const rid = requestID || sellRequestID; // fallback if you didn't pass requestID
    const baseKey = `customer/${quoteID}/contracts`;
    const docx_key = `${baseKey}/contract_${rid}.docx`;
    const pdf_key  = `${baseKey}/contract_${rid}.pdf`;

    const placeholders = {
      owner_name: `${owner.firstName ?? ''} ${owner.lastName ?? ''}`.trim(),
      owner_company: owner.company ?? franchise.legalName ?? '',
      member_name: `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim(),
      member_cboid: member.CBOID ?? '',
      franchise_id: franchiseID ?? '',
      customer_name: quote?.CustomerInfo?.name ?? quote?.customerName ?? '',
      customer_email: quote?.CustomerInfo?.email ?? quote?.customerEmail ?? '',
      facility_address: quote?.CustomerInfo?.address ?? '',
      quote_id: quoteID,
      start_date: quote?.StartDate ?? '',
      service_freq: quote?.SelectedPackage?.frequency ?? quote?.frequency ?? '',
      price: `${quote?.SelectedPackage?.price ?? quote?.price ?? ''}`,
      generated_at: new Date().toISOString(),
    };

    const recipients = {
      ownerEmail: owner.email ?? owner.Email,
      memberEmail: member.email ?? member.Email,
      customerEmail: quote?.CustomerInfo?.email ?? quote?.customerEmail,
    };

    return {
      // inputs for next steps
      template_bucket,
      template_key,
      output_bucket,
      docx_key,
      pdf_key,
      placeholders,
      recipients,
      quoteID,
      sellRequestID,     // ← echo back for later steps if desired
      requestID: rid,    // ← always present downstream
      franchiseID,
      memberCBOID,
    };
  } catch (e: any) {
    console.error('build-contract-context error:', e);
    throw e;
  }
};

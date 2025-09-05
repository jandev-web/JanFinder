import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), { marshallOptions: { removeUndefinedValues: true } });

export const handler = async (event: any) => {
  try {
    const { requestID, memberCBOID, timezone } = event || {};
    if (!requestID || !memberCBOID) throw new Error('Missing requestID/memberCBOID');

    const SELL_REQUEST_TABLE = process.env.SELL_REQUEST_TABLE!;
    const CUSTOMER_QUOTES_TABLE = process.env.CUSTOMER_QUOTES_TABLE!;
    const OWNER_TABLE = process.env.OWNER_TABLE!;
    const CBO_TABLE = process.env.CBO_TABLE!;
    const FRANCHISE_TABLE = process.env.FRANCHISE_TABLE!;
    const TEMPLATE_BUCKET = process.env.TEMPLATE_BUCKET!;
    const OUTPUT_BUCKET = process.env.OUTPUT_BUCKET!;

    // --- Load Sell Request (assumes PK RequestID; change if different) ---
    const reqRes = await ddb.send(new GetCommand({
      TableName: SELL_REQUEST_TABLE,
      Key: { RequestID: requestID },
    }));
    const req = reqRes.Item;
    if (!req) throw new Error('Sell request not found');

    const quoteID = req.QuoteID;
    const ownerID = req.FromOwnerID;

    // --- Load Quote, Owner, Member (CBO), Franchise ---
    const quoteRes = await ddb.send(new GetCommand({ TableName: CUSTOMER_QUOTES_TABLE, Key: { QuoteID: quoteID } }));
    const quote = quoteRes.Item ?? {};

    const ownerRes = await ddb.send(new GetCommand({ TableName: OWNER_TABLE, Key: { OwnerID: ownerID } }));
    const owner = ownerRes.Item ?? {};

    const memberRes = await ddb.send(new GetCommand({ TableName: CBO_TABLE, Key: { CBOID: memberCBOID } }));
    const member = memberRes.Item ?? {};

    const franchiseID = owner.franchiseID || owner.FranchiseID;
    const franRes = await ddb.send(new GetCommand({ TableName: FRANCHISE_TABLE, Key: { FranchiseID: franchiseID } }));
    const franchise = franRes.Item ?? {};

    // --- Determine template location ---
    // Prefer franchise-scoped contract template:
    //   members/franchise/{FranchiseID}/templates/contract.docx
    // Adjust if you store a custom key in Franchise_DB.
    const template_bucket = TEMPLATE_BUCKET;
    const template_key =
      franchise.contractTemplateKey
        ?? `members/franchise/${franchiseID}/templates/contract.docx`;

    // --- Output destination for this contract ---
    const output_bucket = OUTPUT_BUCKET;
    const baseKey = `customer/${quoteID}/contracts`;
    const docx_key = `${baseKey}/contract_${requestID}.docx`;
    const pdf_key  = `${baseKey}/contract_${requestID}.pdf`;

    // --- Placeholders for docx ---
    // Map your template placeholders here.
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
      timezone,
      generated_at: new Date().toISOString(),
    };

    // Email recipients (return to email step)
    const recipients = {
      ownerEmail: owner.email ?? owner.Email,
      memberEmail: member.email ?? member.Email,
      customerEmail: quote?.CustomerInfo?.email ?? quote?.customerEmail,
    };

    return {
      template_bucket,
      template_key,
      output_bucket,
      docx_key,
      pdf_key,
      placeholders,
      recipients,
      quoteID,
      requestID,
      franchiseID,
      memberCBOID,
    };
  } catch (e: any) {
    console.error('build-contract-context error:', e);
    throw e;
  }
};

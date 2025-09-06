// amplify/functions/build-contract-context/index.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

const pick = <T = any>(...vals: any[]): T | undefined => {
  for (const v of vals) if (v !== undefined && v !== null && v !== '') return v as T;
  return undefined;
};
const asStr = (v: any) => (v == null ? '' : String(v));
const fullName = (f?: string, l?: string) => [f ?? '', l ?? ''].join(' ').trim();
const bullet = (label: string, freq?: string) =>
  `• ${label}${freq ? ` (${freq})` : ''}`;
const underline = (s: string) => (s ? '—'.repeat(s.length) : '—'.repeat(5)); // visual underline

export const handler = async (event: any) => {
  try {
    const { requestID, memberCBOID, sellRequestID } = event || {};
    if (!requestID || !memberCBOID) throw new Error('Missing requestID/memberCBOID');

    const SELL_REQUEST_TABLE  = process.env.SELL_REQUEST_TABLE!;
    const CUSTOMER_QUOTES_TBL = process.env.CUSTOMER_QUOTES_TABLE!;
    const OWNER_TABLE         = process.env.OWNER_TABLE!;
    const CBO_TABLE           = process.env.CBO_TABLE!;
    const FRANCHISE_TABLE     = process.env.FRANCHISE_TABLE!;
    const TEMPLATE_BUCKET     = process.env.TEMPLATE_BUCKET!;
    const OUTPUT_BUCKET       = process.env.OUTPUT_BUCKET!;

    // Sell Request (PK = RequestID)
    const reqRes = await ddb.send(new GetCommand({
      TableName: SELL_REQUEST_TABLE,
      Key: { RequestID: sellRequestID ?? requestID },
    }));
    const req = reqRes.Item;
    if (!req) throw new Error('Sell request not found');

    const quoteID = req.QuoteID;
    const ownerID = req.FromOwnerID;

    // Quote
    const quoteRes = await ddb.send(new GetCommand({
      TableName: CUSTOMER_QUOTES_TBL,
      Key: { QuoteID: quoteID },
    }));
    const quote = quoteRes.Item ?? {};

    // Shapes from your logs
    const cust = quote.customerData ?? {};
    const qInfo = quote.quoteInfo ?? {};

    // Selected package (your logs show Quote.Package.packageChoice)
    const pkg = quote.Package?.packageChoice
             ?? quote.packageChoice
             ?? quote.SelectedPackage
             ?? {};

    const selectedPackageName = pick(pkg.packageName, pkg.name) ?? '';
    const selectedPackageCost = pick(pkg.packageCost, pkg.price, quote.price) ?? '';
    const serviceFrequency    = pick(qInfo.frequency, pkg.frequency, quote.frequency) ?? '';

    // Owner, Member, Franchise
    const ownerRes = await ddb.send(new GetCommand({ TableName: OWNER_TABLE, Key: { OwnerID: ownerID } }));
    const owner = ownerRes.Item ?? {};

    const memberRes = await ddb.send(new GetCommand({ TableName: CBO_TABLE, Key: { CBOID: memberCBOID } }));
    const member = memberRes.Item ?? {};

    const franchiseID = pick(owner.FranchiseID, owner.franchiseID, req.FranchiseID, req.franchiseID);
    const franRes = await ddb.send(new GetCommand({ TableName: FRANCHISE_TABLE, Key: { FranchiseID: franchiseID } }));
    const franchise = franRes.Item ?? {};

    // Debug
    console.log('Member', member);
    console.log('Franchise', franchise);
    console.log('Quote', quote);
    console.log('Owner', owner);

    // Template + Output keys
    const template_bucket = TEMPLATE_BUCKET;
    const template_key = pick(franchise.contractTemplateKey)
      ?? `members/franchise/${franchiseID}/templates/contract/contract-template.docx`;

    const output_bucket = OUTPUT_BUCKET;
    const baseKey = `customer/${quoteID}/contracts`;
    const docx_key = `${baseKey}/contract_${requestID}.docx`;
    const pdf_key  = `${baseKey}/contract_${requestID}.pdf`;

    // Values for placeholders
    const nowIso = new Date().toISOString();

    const customerName     = fullName(cust.firstName, cust.lastName) || 'Customer';
    const customerEmail    = asStr(cust.email);
    const customerPhone    = asStr(cust.phone);
    const customerCompany  = asStr(cust.company ?? '');

    const facilityType = pick(qInfo.facilityType, quote.facilityType) ?? '';
    const totalSqft    = pick(qInfo.sqft,        quote.sqft) ?? '';

    const totalMonthTime  = pick(pkg.totalMonthTime, pkg.totalMonthlyTime, pkg.totalDayTimeFromMonth);
    const hardfloorMonth  = pick(pkg.hardfloor?.totalMonthTime, pkg.hardfloor?.totalDayTimeFromMonth);
    const carpetMonth     = pick(pkg.carpet?.totalMonthTime,    pkg.carpet?.totalDayTimeFromMonth);

    const franchiseName = pick(
      franchise.franchiseName, // per your logs
      franchise.legalName,
      franchise.name,
      franchise.company
    ) ?? '';

    const cboName = fullName(pick(member.FirstName, member.firstName), pick(member.LastName, member.lastName));

    // ---------- SECTION TEXT (pretty) ----------
    // ROOMS: Underlined subheading per room, then bullets (task name + frequency only)
    const rooms: any[] = Array.isArray(pkg.rooms) ? pkg.rooms : [];
    const roomsText = rooms.length
      ? rooms.map((r, i) => {
          const rName = pick(r.roomName, r.name) ?? `Room ${i + 1}`;
          const rawTasks = Array.isArray(r.roomTasks) ? r.roomTasks : (Array.isArray(r.tasks) ? r.tasks : []);
          const taskLines = rawTasks
            .map((t: any) => bullet(pick(t.taskName, t.name) ?? 'Task', pick(t.frequency, t.taskFrequency)))
            .join('\n');
          return [
            rName,
            underline(String(rName)),
            taskLines || '• (No tasks listed)',
          ].join('\n');
        }).join('\n\n')
      : '(No room tasks provided)';

    // HARDFLOOR: bullets (task name + frequency only)
    const hardTasks: any[] = Array.isArray(pkg.hardfloor?.tasks) ? pkg.hardfloor.tasks : [];
    const hardText = hardTasks.length
      ? hardTasks.map((t: any) => bullet(pick(t.taskName, t.name) ?? 'Task', pick(t.frequency, t.taskFrequency))).join('\n')
      : '(No hardfloor tasks)';

    // CARPET: bullets (task name + frequency only)
    const carpetTasks: any[] = Array.isArray(pkg.carpet?.tasks) ? pkg.carpet.tasks : [];
    const carpetText = carpetTasks.length
      ? carpetTasks.map((t: any) => bullet(pick(t.taskName, t.name) ?? 'Task', pick(t.frequency, t.taskFrequency))).join('\n')
      : '(No carpet tasks)';

    // EXACT placeholders (bracketed)
    const P: Record<string, string> = {
      '[CONTRACT_TIMESTAMP]': nowIso,
      '[CONFIRMATION_NUMBER]': requestID,
      '[CONFIRMATION_TIMESTAMP]': nowIso,
      '[FRANCHISE_ID]': asStr(franchiseID),
      '[FRANCHISE_NAME]': franchiseName,

      '[CUSTOMER_NAME]': customerName,
      '[CUSTOMER_EMAIL]': customerEmail,
      '[CUSTOMER_PHONE]': customerPhone,

      '[FACILITY_TYPE]': asStr(facilityType),
      '[TOTAL_SQFT]': asStr(totalSqft),
      '[SERVICE_FREQUENCY]': asStr(serviceFrequency),

      '[SELECTED_PACKAGE_NAME]': asStr(selectedPackageName),
      '[SELECTED_PACKAGE_COST]': asStr(selectedPackageCost),
      '[SELECTED_TOTAL_MONTH_TIME]': asStr(totalMonthTime ?? '0'),
      '[HARDFLOOR_TOTAL_MONTH_TIME]': asStr(hardfloorMonth ?? '0'),
      '[CARPET_TOTAL_MONTH_TIME]': asStr(carpetMonth ?? '0'),
    };

    // Alias (non-bracket) keys (harmless if unused by your filler)
    Object.assign(P, {
      CONTRACT_TIMESTAMP: P['[CONTRACT_TIMESTAMP]'],
      CONFIRMATION_NUMBER: P['[CONFIRMATION_NUMBER]'],
      CONFIRMATION_TIMESTAMP: P['[CONFIRMATION_TIMESTAMP]'],
      FRANCHISE_ID: P['[FRANCHISE_ID]'],
      FRANCHISE_NAME: P['[FRANCHISE_NAME]'],
      CUSTOMER_NAME: P['[CUSTOMER_NAME]'],
      CUSTOMER_EMAIL: P['[CUSTOMER_EMAIL]'],
      CUSTOMER_PHONE: P['[CUSTOMER_PHONE]'],
      FACILITY_TYPE: P['[FACILITY_TYPE]'],
      TOTAL_SQFT: P['[TOTAL_SQFT]'],
      SERVICE_FREQUENCY: P['[SERVICE_FREQUENCY]'],
      SELECTED_PACKAGE_NAME: P['[SELECTED_PACKAGE_NAME]'],
      SELECTED_PACKAGE_COST: P['[SELECTED_PACKAGE_COST]'],
      SELECTED_TOTAL_MONTH_TIME: P['[SELECTED_TOTAL_MONTH_TIME]'],
      HARDFLOOR_TOTAL_MONTH_TIME: P['[HARDFLOOR_TOTAL_MONTH_TIME]'],
      CARPET_TOTAL_MONTH_TIME: P['[CARPET_TOTAL_MONTH_TIME]'],
    });

    // Blocks to inject between markers
    const blocks = [
      { start: '[ROOMS_START]',           end: '[ROOMS_END]',           text: roomsText },
      { start: '[HARDFLOOR_TASKS_START]', end: '[HARDFLOOR_TASKS_END]', text: hardText },
      { start: '[CARPET_TASKS_START]',    end: '[CARPET_TASKS_END]',    text: carpetText },
    ];

    // Email context
    const recipients = {
      ownerEmail: pick(owner.email, owner.Email),
      memberEmail: pick(member.email, member.Email),
      customerEmail: pick(cust.email, cust.Email),
    };
    const emailContext = {
      franchiseName: franchiseName,
      cboName: cboName || 'CBO Member',
      customerName: customerName || 'Customer',
      customerCompany: customerCompany || 'Customer Company',
    };

    return {
      // for fill-docx
      template_bucket,
      template_key,
      output_bucket,
      docx_key,
      pdf_key,
      placeholders: P,
      blocks,

      // for email + updates
      recipients,
      emailContext,

      // ids
      quoteID,
      sellRequestID: sellRequestID ?? requestID,
      requestID,
      franchiseID,
      memberCBOID,
    };
  } catch (e: any) {
    console.error('build-contract-context error:', e);
    throw e;
  }
};

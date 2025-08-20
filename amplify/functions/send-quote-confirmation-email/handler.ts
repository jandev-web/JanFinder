import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true },
});
const ses = new SESClient({ region: process.env.AWS_REGION || 'us-east-1' });

const QUOTES  = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';
const SENDER  = process.env.SENDER_EMAIL || 'no-reply@example.com';
const SITE_URL = process.env.SITE_URL || 'https://bid2clean.com';

type AnyObj = Record<string, any>;

function currency(n: number | string | undefined) {
  const val = typeof n === 'string' ? Number(n) : n;
  if (typeof val !== 'number' || Number.isNaN(val)) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
}

function escapeHtml(s: any) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function rowsForFlatTasks(tasks: AnyObj[] | undefined) {
  if (!Array.isArray(tasks) || tasks.length === 0) return '<tr><td colspan="3">None</td></tr>';
  return tasks.map(t => {
    const name = escapeHtml(t.taskName ?? t.name ?? 'Task');
    const freq = escapeHtml(t.taskFrequency ?? t.frequency ?? '');
    
    return `<tr>
      <td style="padding:8px;border:1px solid #ddd;">${name}</td>
      <td style="padding:8px;border:1px solid #ddd;">${freq}</td>
    </tr>`;
  }).join('');
}

function sectionForFlatTasks(label: string, tasks: AnyObj[] | undefined) {
  return `
    <h2>${escapeHtml(label)}</h2>
    <table class="info-table">
      <tr><th>Task</th><th>Frequency</th></tr>
      ${rowsForFlatTasks(tasks)}
    </table>
  `;
}

function sectionForRoomTasks(rooms: AnyObj[] | undefined) {
  if (!Array.isArray(rooms) || rooms.length === 0) {
    return `
      <h2>Room Tasks</h2>
      <table class="info-table"><tr><td>None</td></tr></table>
    `;
  }

  const blocks = rooms.map(r => {
    const roomName = escapeHtml(r.roomName ?? r.roomType ?? 'Room');
    const roomTasks: AnyObj[] = Array.isArray(r.roomTasks) ? r.roomTasks : (Array.isArray(r.tasks) ? r.tasks : []);
    const rows = rowsForFlatTasks(roomTasks);
    return `
      <h3 style="margin-top:10px;">${roomName}</h3>
      <table class="info-table">
        <tr><th>Task</th><th>Frequency</th></tr>
        ${rows}
      </table>
    `;
  }).join('');

  return `<h2>Room Tasks</h2>${blocks}`;
}

// ✅ Amplify Data ONLY — no REST paths
export const handler: Schema['sendQuoteConfirmationEmail']['functionHandler'] = async (event) => {
  const quoteID = event.arguments?.quoteID as string | undefined;
  if (!quoteID) throw new Error("Missing 'quoteID'");

  const res = await ddbDoc.send(new GetCommand({
    TableName: QUOTES,
    Key: { QuoteID: String(quoteID) },
  }));
  const item: AnyObj | undefined = res.Item as AnyObj | undefined;
  if (!item) throw new Error(`No quote found for QuoteID: ${quoteID}`);

  const customer = item.customerData ?? {};
  const firstName = customer.firstName ?? '';
  const lastName  = customer.lastName ?? '';
  const email     = customer.email ?? '';
  const phone     = customer.phone ?? '';
  const company   = customer.company ?? '';
  const addr      = customer.address ?? {};
  const addressStr = [addr.street, addr.city, addr.state, addr.postalCode, addr.country].filter(Boolean).join(', ');

  const qi = item.quoteInfo ?? {};
  const frequency = qi.frequency ?? '';
  const facility  = qi.facilityType ?? '';
  const confirmationNumber = item.ConfirmationNumber ?? '';

  // Package shape assumed from your message
  const packageInfo = item?.Package?.packageChoice ?? item?.Package ?? {};
  const carpetTasks = packageInfo?.carpet?.tasks as AnyObj[] | undefined;
  const hardfloorTasks = packageInfo?.hardfloor?.tasks as AnyObj[] | undefined;
  const packageRooms = packageInfo?.rooms as AnyObj[] | undefined;
  const cost = packageInfo?.packageCost;

  if (!email) throw new Error(`Quote ${quoteID} does not have an email field`);

  // TEXT body (kept succinct)
  const bodyText = `Dear ${firstName} ${lastName},

Thank you for choosing Bid2Clean. Your quote is confirmed.

Confirmation Number: ${confirmationNumber}
Package Cost: ${currency(cost)}

Customer:
  Company: ${company}
  Email: ${email}
  Phone: ${phone}
  Address: ${addressStr}

Quote:
  Facility Type: ${facility}
  Service Frequency: ${frequency}

Carpet Tasks:
${Array.isArray(carpetTasks) && carpetTasks.length ? carpetTasks.map(t => ` - ${t.taskName ?? t.name ?? 'Task'} (${t.taskFrequency ?? t.frequency ?? ''})`).join('\n') : ' - None'}

Hardfloor Tasks:
${Array.isArray(hardfloorTasks) && hardfloorTasks.length ? hardfloorTasks.map(t => ` - ${t.taskName ?? t.name ?? 'Task'} (${t.taskFrequency ?? t.frequency ?? ''})`).join('\n') : ' - None'}

Room Tasks:
${Array.isArray(packageRooms) && packageRooms.length ? packageRooms.map(r => {
  const roomName = r.roomName ?? r.roomType ?? 'Room';
  const rts = Array.isArray(r.roomTasks) ? r.roomTasks : (Array.isArray(r.tasks) ? r.tasks : []);
  return ` * ${roomName}\n${rts.length ? rts.map(t => `    - ${t.taskName ?? t.name ?? 'Task'} (${t.taskFrequency ?? t.frequency ?? ''})`).join('\n') : '    - None'}`;
}).join('\n') : ' - None'}

You can check your bid status at ${SITE_URL}/quote-status

Sincerely,
The Bid2Clean Team
`;

  // HTML body
  const carpetSection = sectionForFlatTasks('Carpet Tasks', carpetTasks);
  const hardfloorSection = sectionForFlatTasks('Hardfloor Tasks', hardfloorTasks);
  const roomsSection = sectionForRoomTasks(packageRooms);

  const bodyHtml = `
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
      .container { width: 80%; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
      .header { background-color: #001F54; color: #FFD700; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
      h1 { font-size: 32px; font-weight: 700; margin: 0; }
      .content { padding: 20px; }
      .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      .info-table th, .info-table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
      .cost-pill { display:inline-block; background:#FFF7CC; color:#1F2937; padding:8px 12px; border-radius:8px; font-weight:700; margin-top:8px; }
      .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
      .button { background-color: #FFD700; color: #001F54; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin-top: 15px; transition: background-color 0.3s ease; }
      .button:hover { background-color: #FFB800; }
      h2 { margin-top: 24px; }
      h3 { margin: 8px 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h1>Bid2Clean Quote Confirmation</h1></div>
      <div class="content">
        <p>Dear ${escapeHtml(firstName)} ${escapeHtml(lastName)},</p>
        <p>Thank you for choosing Bid2Clean for your quote request. We are pleased to confirm your quote with the following details:</p>

        <h2>Confirmation Details</h2>
        <p><strong>Confirmation Number:</strong> ${escapeHtml(confirmationNumber)}</p>
        <p class="cost-pill">Package Cost: ${escapeHtml(currency(cost))}</p>

        <h2>Customer Information</h2>
        <table class="info-table">
          <tr><th>Company</th><td>${escapeHtml(company)}</td></tr>
          <tr><th>Email</th><td>${escapeHtml(email)}</td></tr>
          <tr><th>Phone</th><td>${escapeHtml(String(phone))}</td></tr>
          <tr><th>Address</th><td>${escapeHtml(addressStr)}</td></tr>
        </table>

        <h2>Quote Details</h2>
        <table class="info-table">
          <tr><th>Facility Type</th><td>${escapeHtml(facility)}</td></tr>
          <tr><th>Service Frequency</th><td>${escapeHtml(frequency)}</td></tr>
        </table>

        ${carpetSection}
        ${hardfloorSection}
        ${roomsSection}

        <p>If you have questions, reach out to us at info@bid2clean.com.</p>
        <p><a href="${SITE_URL}/quote-status" class="button">Check Bid Status</a></p>
        <p>Sincerely,<br/>The Bid2Clean Team</p>
      </div>
      <div class="footer">
        <p>This is an automated message from Bid2Clean. Please do not reply directly to this email.</p>
      </div>
    </div>
  </body>
</html>`;

  await ses.send(new SendEmailCommand({
    Source: SENDER,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: 'Your Bid2Clean Quote Confirmation' },
      Body: {
        Text: { Data: bodyText },
        Html: { Data: bodyHtml },
      },
    },
  }));

  return { message: 'Confirmation email sent successfully.' };
};

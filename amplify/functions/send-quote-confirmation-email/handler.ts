import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});
const ses = new SESClient({});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';
const SENDER = process.env.SENDER_EMAIL || 'no-reply@example.com';
const SITE_URL = process.env.SITE_URL || 'https://bid2clean.com';

export const handler: Handler = async (event: any) => {
  try {
    // Support Amplify Data (event.arguments) and REST (event.body)
    let quoteID: string | undefined;

    if (event?.arguments) {
      quoteID = event.arguments.quoteID ?? event.arguments?.payload?.quoteID;
    } else if (event?.body) {
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      quoteID = body?.quoteID;
    }

    if (!quoteID) {
      return respond(event, 400, "Missing 'quoteID' in the payload.");
    }

    // 1) Fetch quote
    const res = await ddbDoc.send(new GetCommand({
      TableName: QUOTES,
      Key: { QuoteID: String(quoteID) },
    }));

    const item = res.Item;
    if (!item) {
      return respond(event, 404, `No quote found for QuoteID: ${quoteID}`);
    }

    // 2) Extract data
    const customer = item.customerData ?? {};
    const firstName = customer.firstName ?? '';
    const lastName  = customer.lastName ?? '';
    const email     = customer.email ?? '';
    const phone     = customer.phone ?? '';
    const company   = customer.company ?? '';
    const addr      = customer.address ?? {};
    const addressStr = [addr.street, addr.city, addr.state, addr.postalCode, addr.country]
      .filter(Boolean)
      .join(', ');

    const qi = item.quoteInfo ?? {};
    const frequency = qi.frequency ?? '';
    const facility  = qi.facilityType ?? '';
    const roomsList = Array.isArray(qi.roomTypes) ? qi.roomTypes : [];
    const confirmationNumber = item.ConfirmationNumber ?? '';

    if (!email) {
      return respond(event, 400, `The retrieved quote does not have an 'email' field.`);
    }

    // 3) Build rooms text & HTML rows
    let roomsText = '';
    let roomsHtmlRows = '';
    if (roomsList.length) {
      for (const r of roomsList) {
        const rt = r.roomType ?? 'Unknown';
        const totalSqft = r?.sqft?.totalSqft ?? 0;
        roomsText += ` - ${rt}: ${totalSqft} sqft\n`;
        roomsHtmlRows += (
          `<tr>
            <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(rt)}</td>
            <td style="padding:8px;border:1px solid #ddd;">${totalSqft} sqft</td>
          </tr>`
        );
      }
    } else {
      roomsText = 'None\n';
      roomsHtmlRows = `<tr><td colspan="2">None</td></tr>`;
    }

    // 4) Build email
    const subject = 'Your Bid2Clean Quote Confirmation';
    const bodyText = `Dear ${firstName} ${lastName},

Thank you for choosing Bid2Clean for your quote request. We are pleased to confirm your quote with the following details:

Confirmation Number: ${confirmationNumber}

Customer Information:
    Company: ${company}
    Email: ${email}
    Phone: ${phone}
    Address: ${addressStr}

Quote Details:
    Facility Type: ${facility}
    Service Frequency: ${frequency}

Selected Rooms:
${roomsText}
We appreciate the opportunity to serve you. If you have any questions or need further assistance, please do not hesitate to contact us.

Sincerely,
The Bid2Clean Team
`;

    const bodyHtml = `
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
      .container { width: 80%; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 10px;
                   box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
      .header { background-color: #001F54; color: #FFD700; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
      h1 { font-size: 36px; font-weight: 700; margin: 0; }
      .content { padding: 20px; }
      .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      .info-table th, .info-table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
      .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
      .button { background-color: #FFD700; color: #001F54; padding: 12px 20px; text-align: center; text-decoration: none;
                border-radius: 5px; display: inline-block; font-weight: bold; margin-top: 15px; transition: background-color 0.3s ease; }
      .button:hover { background-color: #FFB800; }
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

        <h2>Selected Rooms</h2>
        <table class="info-table">
          <tr><th>Room Type</th><th>Square Footage</th></tr>
          ${roomsHtmlRows}
        </table>

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

    // 5) Send via SES
    await ses.send(new SendEmailCommand({
      Source: SENDER,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: subject },
        Body: {
          Text: { Data: bodyText },
          Html: { Data: bodyHtml },
        },
      },
    }));

    return respond(event, 200, 'Confirmation email sent successfully.');
  } catch (err: any) {
    console.error('Error in send-quote-confirmation-email:', err);
    return respond(event, 500, `Error: ${err?.message ?? String(err)}`);
  }
};

function respond(event: any, statusCode: number, payload: any) {
  if (event?.requestContext?.http) {
    // REST response
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      },
      body: typeof payload === 'string' ? JSON.stringify({ message: payload }) : JSON.stringify(payload),
    };
  }
  // Amplify Data response
  if (statusCode >= 400) throw new Error(typeof payload === 'string' ? payload : payload?.message || 'Error');
  return typeof payload === 'string' ? { message: payload } : payload;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


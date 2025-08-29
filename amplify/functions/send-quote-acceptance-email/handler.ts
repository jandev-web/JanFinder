// amplify/functions/send-quote-acceptance-email/handler.ts
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { randomUUID } from 'node:crypto';

const ddb = new DynamoDBClient({});
const s3 = new S3Client({});
const ses = new SESClient({});

const CUSTOMER_QUOTES_TABLE = process.env.CUSTOMER_QUOTES_TABLE ?? 'CustomerQuotes';
const FRANCHISE_TABLE       = process.env.FRANCHISE_TABLE ?? 'Franchise_DB';
const QUOTE_PDF_BUCKET_NAME = process.env.QUOTE_PDF_BUCKET_NAME ?? '';
const FROM_EMAIL            = process.env.FROM_EMAIL ?? 'noreply@bid2clean.com';

type AppSyncEvent = {
  body?: any; // when invoked from owner-accept-quote we send { body:{ quoteID }, requestId }
  arguments?: { quoteID?: string };
  requestId?: string;
};

function log(rid: string, msg: string, extra: Record<string, any> = {}) {
  // keep logs compact but structured
  console.log(`[send-quote-acceptance-email][${rid}] ${msg}`, JSON.stringify(extra));
}

function toBase64(u8: Uint8Array) {
  return Buffer.from(u8).toString('base64');
}

function buildRawEmail(params: {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  attachmentBase64: string;
  attachmentName: string;
}) {
  const boundary = `Mixed_${Date.now()}`;
  const altBoundary = `Alt_${Date.now()}`;

  const headers = [
    `From: ${params.from}`,
    `To: ${params.to}`,
    `Subject: ${params.subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
    '',
    `--${altBoundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    '',
    params.text,
    '',
    `--${altBoundary}`,
    'Content-Type: text/html; charset=UTF-8',
    '',
    params.html,
    '',
    `--${altBoundary}--`,
    '',
    `--${boundary}`,
    `Content-Type: application/pdf; name="${params.attachmentName}"`,
    'Content-Transfer-Encoding: base64',
    `Content-Disposition: attachment; filename="${params.attachmentName}"`,
    '',
    params.attachmentBase64,
    '',
    `--${boundary}--`,
    '',
  ].join('\r\n');

  return new TextEncoder().encode(headers);
}

export const handler = async (event: AppSyncEvent, context?: any) => {
  const requestId = event?.requestId || context?.awsRequestId || randomUUID();

  log(requestId, 'START', {
    env: {
      CUSTOMER_QUOTES_TABLE,
      FRANCHISE_TABLE,
      QUOTE_PDF_BUCKET_NAME,
      FROM_EMAIL,
    },
    eventKeys: Object.keys(event || {}),
    hasBody: !!event?.body,
    hasArgs: !!event?.arguments,
  });

  try {
    // -------- Parse input --------
    let body: any = {};
    try {
      if (typeof event?.body === 'string') body = JSON.parse(event.body);
      else body = event?.body ?? event?.arguments ?? {};
    } catch (e: any) {
      log(requestId, 'Body parse failed', { error: String(e) });
      return { statusCode: 400, body: JSON.stringify({ message: 'Invalid body JSON' }), requestId };
    }

    const quoteID = body?.quoteID;
    if (!quoteID) {
      log(requestId, 'Missing quoteID');
      return { statusCode: 400, body: JSON.stringify({ message: 'Missing quoteID' }), requestId };
    }
    log(requestId, 'Parsed input', { quoteID });

    // -------- DDB: get quote --------
    log(requestId, 'DDB GetItem (CustomerQuotes)', { table: CUSTOMER_QUOTES_TABLE, quoteID });
    const getQuote = await ddb.send(
      new GetItemCommand({
        TableName: CUSTOMER_QUOTES_TABLE,
        Key: { QuoteID: { S: quoteID } },
      })
    );
    if (!getQuote.Item) {
      log(requestId, 'Quote not found');
      return { statusCode: 404, body: JSON.stringify({ message: 'Quote not found' }), requestId };
    }
    const quote = unmarshall(getQuote.Item);
    const customer = quote?.customerData ?? {};
    const toEmail: string = customer?.email ?? '';
    const first = customer?.firstName ?? '';
    const last = customer?.lastName ?? '';
    const franchiseID = quote?.Franchise;

    if (!toEmail) {
      log(requestId, 'Missing customer email on quote', { quoteID });
      return { statusCode: 400, body: JSON.stringify({ message: 'Customer email missing on quote' }), requestId };
    }
    log(requestId, 'Quote loaded', { hasEmail: !!toEmail, franchiseID });

    // -------- DDB: get franchise (optional) --------
    let franchiseName = 'Unknown Franchise';
    if (franchiseID) {
      log(requestId, 'DDB GetItem (Franchise)', { table: FRANCHISE_TABLE, franchiseID });
      try {
        const getFr = await ddb.send(
          new GetItemCommand({
            TableName: FRANCHISE_TABLE,
            Key: { FranchiseID: { S: String(franchiseID) } },
          })
        );
        if (getFr.Item) {
          const fr = unmarshall(getFr.Item);
          franchiseName = fr?.franchiseName || fr?.Name || franchiseName;
        }
      } catch (e: any) {
        log(requestId, 'Franchise lookup failed (continuing)', { error: String(e) });
      }
    }
    log(requestId, 'Franchise resolved', { franchiseName });

    // -------- S3: fetch PDF --------
    const key = `customer/${quoteID}/quotes/quote.pdf`;
    log(requestId, 'S3 GetObject (PDF)', { bucket: QUOTE_PDF_BUCKET_NAME, key });
    let pdfBytes: Uint8Array;
    try {
      const s3Obj = await s3.send(new GetObjectCommand({ Bucket: QUOTE_PDF_BUCKET_NAME, Key: key }));
      const arr = await s3Obj.Body!.transformToByteArray();
      pdfBytes = new Uint8Array(arr);
      log(requestId, 'S3 PDF fetched', {
        contentLength: s3Obj.ContentLength ?? pdfBytes.length,
        etag: s3Obj.ETag,
      });
    } catch (e: any) {
      log(requestId, 'S3 GetObject failed', { error: String(e) });
      // Surface 404 vs generic error if possible
      const msg = /NoSuchKey/i.test(String(e?.name) + String(e?.$metadata)) ? 'PDF not found in S3' : 'Failed to get PDF from S3';
      return { statusCode: 500, body: JSON.stringify({ message: msg }), requestId };
    }

    const pdfB64 = toBase64(pdfBytes);
    log(requestId, 'PDF base64 prepared', { sizeBytes: pdfBytes.length, sizeB64: pdfB64.length });

    // -------- Build email --------
    const subject = 'Your Quote is Ready';
    const text = `Dear ${first} ${last},

Your Clean2Bid quote is attached to this email.

Thank you,
The Clean2Bid Team
`;
    const html = `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <div style="max-width:600px; margin:auto; padding:20px; border:1px solid #ddd;">
      <h1 style="text-align:center; color:#001F54;">Your Contract</h1>
      <p>Dear ${first} ${last},</p>
      <p>Your Clean2Bid quote has been accepted by ${franchiseName} and is attached to this email.</p>
      <p>Thank you,<br>The Clean2Bid Team</p>
      <p style="font-size:0.8em; color:#555;">This is an automated message. Please do not reply.</p>
    </div>
  </body>
</html>`.trim();

    const raw = buildRawEmail({
      from: FROM_EMAIL,
      to: toEmail,
      subject,
      text,
      html,
      attachmentBase64: pdfB64,
      attachmentName: `${franchiseName}_quote.pdf`,
    });
    log(requestId, 'Raw email constructed', {
      to: toEmail,
      from: FROM_EMAIL,
      subject,
      rawSize: raw.byteLength,
    });

    // -------- SES: send --------
    try {
      const sesResp = await ses.send(
        new SendRawEmailCommand({
          RawMessage: { Data: raw },
          // Source is optional for SendRawEmail, but the FROM_EMAIL must be verified in SES.
        })
      );
      log(requestId, 'SES send success', { messageId: sesResp.MessageId });
    } catch (e: any) {
      log(requestId, 'SES send failed', { error: String(e), code: e?.name, $meta: e?.$metadata });
      // common gotchas: identity not verified, region mismatch, sending not enabled in region, address blacklisted
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error sending email via SES',
          hint:
            'Verify FROM_EMAIL identity in SES and ensure sandbox/production settings allow sending to the recipient.',
        }),
        requestId,
      };
    }

    log(requestId, 'DONE');
    return { statusCode: 200, body: JSON.stringify('Contract email sent successfully.'), requestId };
  } catch (e: any) {
    log(requestId, 'FATAL', { error: String(e) });
    return { statusCode: 500, body: JSON.stringify(`Unexpected error: ${e?.message ?? e}`), requestId };
  }
};

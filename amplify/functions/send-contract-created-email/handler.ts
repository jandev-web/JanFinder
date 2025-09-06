import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import crypto from 'crypto';

const ses = new SESClient({});
const s3  = new S3Client({});

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (d) => chunks.push(Buffer.isBuffer(d) ? d : Buffer.from(d)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export const handler = async (event: any) => {
  // Expecting: { recipients, emailContext, bucket, pdf_key }
  const { recipients = {}, emailContext = {}, bucket, pdf_key } = event || {};
  const from = process.env.FROM_EMAIL!;
  if (!from) throw new Error('FROM_EMAIL env var is required');

  const to = [recipients.ownerEmail, recipients.memberEmail, recipients.customerEmail]
    .filter(Boolean) as string[];
  if (!to.length) return { ok: true };

  const franchiseName   = (emailContext.franchiseName ?? '').toString() || 'Franchise';
  const cboName         = (emailContext.cboName ?? '').toString()       || 'Member';
  const customerName    = (emailContext.customerName ?? '').toString()  || 'Customer';
  const customerCompany = (emailContext.customerCompany ?? '').toString()|| 'Customer Company';

  const subject = `${customerCompany} — Contract Created`;
  const fileName = `${franchiseName}-Contract.pdf`;

  // Fetch the PDF from S3
  const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: pdf_key }));
  const pdfBytes = await streamToBuffer(obj.Body as Readable);
  const pdfBase64 = pdfBytes.toString('base64');

  const html = `
    <p>Hello ${customerName},</p>
    <p>Your contract has been <strong>accepted</strong>.</p>
    <ul>
      <li><strong>Service Provider (Franchise):</strong> ${franchiseName}</li>
      <li><strong>Accepted By (CBO):</strong> ${cboName}</li>
    </ul>
    <p>The signed contract PDF is attached to this email.</p>
    <p>Thank you!</p>
  `.trim();

  const text = [
    `Hello ${customerName},`,
    ``,
    `Your contract has been accepted.`,
    ``,
    `Service Provider (Franchise): ${franchiseName}`,
    `Accepted By (CBO): ${cboName}`,
    ``,
    `The signed contract PDF is attached to this email.`,
    ``,
    `Thank you!`,
  ].join('\n');

  // Build MIME with attachment
  const boundary = `Mixed_${crypto.randomUUID()}`;
  const altBoundary = `Alt_${crypto.randomUUID()}`;

  const mime =
    `From: ${from}\r\n` +
    `To: ${to.join(', ')}\r\n` +
    `Subject: ${subject}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: multipart/mixed; boundary="${boundary}"\r\n` +
    `\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: multipart/alternative; boundary="${altBoundary}"\r\n` +
    `\r\n` +
    `--${altBoundary}\r\n` +
    `Content-Type: text/plain; charset="UTF-8"\r\n` +
    `Content-Transfer-Encoding: 7bit\r\n` +
    `\r\n` +
    `${text}\r\n` +
    `\r\n` +
    `--${altBoundary}\r\n` +
    `Content-Type: text/html; charset="UTF-8"\r\n` +
    `Content-Transfer-Encoding: 7bit\r\n` +
    `\r\n` +
    `${html}\r\n` +
    `\r\n` +
    `--${altBoundary}--\r\n` +
    `\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: application/pdf; name="${fileName}"\r\n` +
    `Content-Description: ${fileName}\r\n` +
    `Content-Disposition: attachment; filename="${fileName}"; size=${pdfBytes.length};\r\n` +
    `Content-Transfer-Encoding: base64\r\n` +
    `\r\n` +
    `${pdfBase64}\r\n` +
    `\r\n` +
    `--${boundary}--`;

  await ses.send(new SendRawEmailCommand({
    RawMessage: { Data: Buffer.from(mime) },
    Destinations: to,
    Source: from,
  }));

  return { ok: true };
};

import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import type { Readable } from 'stream';

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

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const handler = async (event: any) => {
  const {
    recipients,
    bucket,
    pdf_key,
    customerName,
    customerCompany,
    franchiseName,
    member,
    memberName,
  } = event || {};

  const from = process.env.FROM_EMAIL!;
  const to = [recipients?.ownerEmail, recipients?.memberEmail, recipients?.customerEmail]
    .filter(Boolean) as string[];
  if (!from || to.length === 0) return { ok: true };

  // Derive names/text safely
  const safeCustomerName   = customerName || 'there';
  const safeCompany        = customerCompany || 'Your Company';
  const safeFranchiseName  = franchiseName || 'Your Franchise';
  const safeMemberName =
    memberName ||
    [member?.firstName, member?.lastName].filter(Boolean).join(' ').trim() ||
    'our cleaning partner';

  // Fetch the PDF from S3 to attach
  const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: pdf_key }));
  const body = obj.Body as Readable;
  const pdfBuffer = await streamToBuffer(body);

  const fileName = `${safeFranchiseName}-Contract.pdf`;

  // Build a MIME message with attachment (SES requires CRLF line endings)
  const boundary = `----=_Part_${Date.now()}`;
  const subject  = `${safeCompany} — Contract Accepted`;

  const htmlBody = `
<p>Hi ${escapeHtml(safeCustomerName)},</p>
<p>Your contract has been <strong>accepted</strong> by <strong>${escapeHtml(
    safeMemberName
  )}</strong> with <strong>${escapeHtml(safeFranchiseName)}</strong>.</p>
<p>The finalized contract PDF is attached to this email.</p>
<p>Thank you,<br/>${escapeHtml(safeFranchiseName)}</p>
`.trim();

  const textBody = `Hi ${safeCustomerName},

Your contract has been accepted by ${safeMemberName} with ${safeFranchiseName}.

The finalized contract PDF is attached to this email.

Thank you,
${safeFranchiseName}
`.trim();

  const mixedBoundary = boundary; // top-level multipart/mixed
  const altBoundary   = `${boundary}_alt`; // inner multipart/alternative

  const raw =
    [
      `From: ${from}`,
      `To: ${to.join(', ')}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary="${mixedBoundary}"`,
      '',
      `--${mixedBoundary}`,
      `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
      '',
      `--${altBoundary}`,
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      textBody,
      '',
      `--${altBoundary}`,
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      htmlBody,
      '',
      `--${altBoundary}--`,
      '',
      `--${mixedBoundary}`,
      `Content-Type: application/pdf; name="${fileName}"`,
      'Content-Description: Contract PDF',
      `Content-Disposition: attachment; filename="${fileName}"`,
      'Content-Transfer-Encoding: base64',
      '',
      pdfBuffer.toString('base64'),
      '',
      `--${mixedBoundary}--`,
      '',
    ].join('\r\n');

  await ses.send(
    new SendRawEmailCommand({
      RawMessage: { Data: Buffer.from(raw) },
    })
  );

  return { ok: true };
};

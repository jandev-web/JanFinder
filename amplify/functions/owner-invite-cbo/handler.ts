// amplify/functions/owner-invite-cbo/handler.ts
import type { Handler } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import crypto from 'crypto';

const ses = new SESClient({});
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL!;
const SES_FROM_EMAIL = process.env.SES_FROM_EMAIL!;
const SECRET = process.env.INVITE_HMAC_SECRET!;
const TTL_HOURS = parseInt(process.env.INVITE_TTL_HOURS || '48', 10);

type Args = { franchiseID: string; email: string };

const b64url = (buf: Buffer) =>
  buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

const sign = (payload: string) =>
  b64url(crypto.createHmac('sha256', SECRET).update(payload).digest());

export const handler: Handler = async (event) => {
  const args = (event?.arguments ?? {}) as Args;
  const franchiseID = (args.franchiseID || '').trim();
  const email = (args.email || '').trim().toLowerCase();

  if (!franchiseID || !email) {
    return { statusCode: 400, body: JSON.stringify({ ok:false, message:'Missing input' }) };
  }

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + TTL_HOURS * 3600;
  const payloadObj = { email, franchiseID, iat, exp };
  const payload = b64url(Buffer.from(JSON.stringify(payloadObj)));
  const sig = sign(payload);
  const token = `${payload}.${sig}`;

  const link = `${FRONTEND_BASE_URL}/members/sign-up/cbo/invite?token=${encodeURIComponent(token)}`;
  const subject = 'You’re invited to join a franchise';
  const html = `
    <p>You’ve been invited to join a franchise as a member.</p>
    <p><a href="${link}">Click here to create your account</a>.</p>
    <p>This link expires in ${TTL_HOURS} hours.</p>
  `;

  await ses.send(new SendEmailCommand({
    Destination: { ToAddresses: [email] },
    Message: { Subject: { Data: subject }, Body: { Html: { Data: html } } },
    Source: SES_FROM_EMAIL,
  }));

  return { statusCode: 200, body: JSON.stringify({ ok:true }) };
};

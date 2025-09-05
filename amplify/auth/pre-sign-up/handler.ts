// amplify/auth/pre-sign-up/handler.ts
import type { PreSignUpTriggerHandler } from 'aws-lambda';
import { randomUUID, timingSafeEqual, createHmac } from 'crypto';

// === unchanged ===
const normalizeRole = (r?: string) => {
  const v = (r || '').trim().toLowerCase();
  if (v === 'owner') return 'Owner';
  if (v === 'member') return 'Member';
  return undefined;
};

// === minimal helpers for invite token ===
const SECRET = process.env.INVITE_HMAC_SECRET || ''; // must be set in function env

const b64urlToBuf = (s: string) =>
  Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

const b64url = (buf: Buffer) =>
  buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/,'');

const sign = (payload: string) =>
  b64url(createHmac('sha256', SECRET).update(payload).digest());

export const handler: PreSignUpTriggerHandler = async (event) => {
  // Only run for native self sign-up
  if (event.triggerSource !== 'PreSignUp_SignUp') return event;

  const attrs = event.request.userAttributes ?? {};
  const token = event.request.clientMetadata?.token; // <-- invite token (optional)

  // ===== CBO invite path (token present) =====
  // ===== CBO invite path (token present) =====
if (token) {
  if (!SECRET) throw new Error('Server not configured');

  const t = String(token).trim();
  const dotIdx = t.indexOf('.');
  if (dotIdx === -1) throw new Error('Invalid invite token (no dot)');

  const payloadPart = t.slice(0, dotIdx);      // base64url JSON (do NOT decode before HMAC)
  const sigB64url  = t.slice(dotIdx + 1);      // base64url(HMAC)

  // Compute expected RAW digest of the payloadPart
  const expectedRaw = createHmac('sha256', SECRET).update(payloadPart).digest(); // 32 bytes

  // Decode the provided base64url signature into RAW bytes
  let sigRaw: Buffer;
  try {
    sigRaw = b64urlToBuf(sigB64url); // -> 32 bytes when valid
  } catch {
    throw new Error('Invalid invite token (bad base64url)');
  }

  // Length-safe, timing-safe comparison of raw bytes
  if (sigRaw.length !== expectedRaw.length || !timingSafeEqual(sigRaw, expectedRaw)) {
    throw new Error('Invalid invite token');
  }

  // Decode payload JSON
  let payload: { email: string; franchiseID: string; iat: number; exp: number };
  try {
    payload = JSON.parse(b64urlToBuf(payloadPart).toString('utf8'));
  } catch {
    throw new Error('Invalid invite token payload');
  }

  const now = Math.floor(Date.now() / 1000);
  if (!payload?.email || !payload?.franchiseID || now >= Number(payload.exp)) {
    throw new Error('Invite is expired or malformed');
  }

  const emailAttr = (attrs['email'] || '').toLowerCase();
  if (!emailAttr || emailAttr !== String(payload.email).toLowerCase()) {
    throw new Error('Email mismatch');
  }

  // Force role + franchise from token (ignore client-provided values)
  event.request.userAttributes['custom:role'] = 'Member';
  event.request.userAttributes['custom:FranchiseID'] = payload.franchiseID;

  event.response.autoConfirmUser = true;
  if (attrs['phone_number']) event.response.autoVerifyPhone = true;
  event.response.autoVerifyEmail = true;

  return event;
}


  // ===== Original path (e.g., Owner sign-up) — unchanged logic =====
  // 1) Validate/normalize role (from custom attribute or clientMetadata)
  const roleIncoming = attrs['custom:role'] ?? event.request.clientMetadata?.role;
  const role = normalizeRole(roleIncoming);
  console.log('Role: ', role)
  if (!role) {
    throw new Error("Invalid role. 'custom:role' must be 'Owner' or 'Member'.");
  }
  event.request.userAttributes['custom:role'] = role;

  // 2) Ensure FranchiseID exists (from custom attr / clientMetadata / generate)
  let franchiseId =
    attrs['custom:FranchiseID'] ??
    event.request.clientMetadata?.FranchiseID;

  if (!franchiseId) {
    // If you prefer to *require* the client to send it, keep throwing:
    throw new Error("Missing 'custom:FranchiseID'.");
    // Or generate one:
    // franchiseId = randomUUID();
  }
  event.request.userAttributes['custom:FranchiseID'] = franchiseId;

  // 3) Auto-confirm user; do NOT auto-verify email (you verify on first login)
  event.response.autoConfirmUser = true;

  // 4) If a phone number was provided, auto-verify it to avoid SMS challenges
  if (attrs['phone_number']) {
    event.response.autoVerifyPhone = true;
  }

  return event;
};


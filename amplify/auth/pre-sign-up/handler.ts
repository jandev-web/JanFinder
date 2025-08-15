// amplify/auth/pre-sign-up/handler.ts
import type { PreSignUpTriggerHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';

const normalizeRole = (r?: string) => {
  const v = (r || '').trim().toLowerCase();
  if (v === 'owner') return 'Owner';
  if (v === 'member') return 'Member';
  return undefined;
};

export const handler: PreSignUpTriggerHandler = async (event) => {
  // Only run for native self sign-up
  if (event.triggerSource !== 'PreSignUp_SignUp') return event;

  const attrs = event.request.userAttributes ?? {};

  // 1) Validate/normalize role (from custom attribute or clientMetadata)
  const roleIncoming = attrs['custom:role'] ?? event.request.clientMetadata?.role;
  const role = normalizeRole(roleIncoming);
  if (!role) {
    throw new Error("Invalid role. 'custom:role' must be 'Owner' or 'Member'.");
  }
  event.request.userAttributes['custom:role'] = role;

  // 2) Ensure FranchiseID exists (from custom attr / clientMetadata / generate)
  let franchiseId =
    attrs['custom:FranchiseID'] ??
    event.request.clientMetadata?.FranchiseID;

  if (!franchiseId) {
    // If you prefer to *require* the client to send it, replace this with:
    throw new Error("Missing 'custom:FranchiseID'.");
    //franchiseId = randomUUID();
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

// src/utils/auth-state.ts
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

export async function isSignedIn(): Promise<boolean> {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
}

export async function getSessionSummary() {
  const s = await fetchAuthSession(); // also provisions guest creds if available
  return {
    hasTokens: !!s.tokens?.accessToken,      // user is signed-in if true
    hasCreds: !!s.credentials,               // guest/user IAM creds present
    identityId: s.identityId ?? null,
  };
}

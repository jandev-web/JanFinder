import { fetchAuthSession } from 'aws-amplify/auth';
import outputs from '../../amplify_outputs.json'; // path from your util file

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (outputs)?.custom?.apiUrl;

if (!API_BASE) {
  throw new Error('API base URL not configured');
}

const createOwner = async (ownerData) => {
  if (!API_BASE) throw new Error('Missing NEXT_PUBLIC_API_URL');

  const { tokens } = await fetchAuthSession();
  const jwt =
    tokens?.accessToken?.toString() || tokens?.idToken?.toString();
  if (!jwt) throw new Error('You must be signed in.');

  const res = await fetch(`${API_BASE}/owner`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ownerData }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload?.error || payload?.message || `Create owner failed (${res.status})`);
  }
  return payload;
};

export default createOwner;

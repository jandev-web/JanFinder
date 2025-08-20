// Mark this as server-only so it never gets bundled client-side.
export const dynamic = 'force-dynamic';

export async function getOwnerByIdServer(ownerId: string) {
  // Replace this with your real server-side fetch logic.
  // Example: call an internal API route or a direct SDK call.
  // return await someSdk.getOwner({ ownerId });

  const res = await fetch(`${process.env.INTERNAL_API_BASE_URL}/owners/${ownerId}`, {
    method: 'GET',
    headers: {
      // If you need to forward a token from fetchAuthSession(session.tokens?.idToken?.toString()),
      // add it here as an Authorization header. Keep it SERVER SIDE only.
      'Content-Type': 'application/json',
      'x-internal-secret': process.env.INTERNAL_API_SECRET || '',
    },
    // Important in Next.js to ensure SSR/edge caching behaves as expected:
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch owner: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

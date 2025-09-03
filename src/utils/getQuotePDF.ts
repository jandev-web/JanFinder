'use server';

import { cookies } from 'next/headers';
import { runWithAmplifyServerContext } from '@/utils/amplify-server';
import { getUrl } from 'aws-amplify/storage/server';

/**
 * Returns a signed URL for a quote PDF stored in Amplify Storage (public access level).
 * Expects the file at: public/customer/{quoteID}/quotes/quote.pdf
 */
export default async function getQuotePDF(quoteID: string): Promise<{ url: string }> {
  if (!quoteID) throw new Error('Missing quoteID');

  // Path is relative to the access level ("public"). Do NOT prefix with "public/" here.
  const path = `customer/${quoteID}/quotes/quote.pdf`;
  console.log(path)
  const result = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (ctx) =>
      getUrl(ctx, {
        path,
        options: {
          expiresIn: 60 * 60, // 1 hour
        },
      }),
  });

  const url =
    typeof (result as any)?.url === 'string'
      ? (result as any).url
      : (result as any)?.url?.toString?.();

  if (!url) throw new Error('Failed to generate PDF URL.');

  return { url };
}
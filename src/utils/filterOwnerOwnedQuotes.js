export default async function filterOwnerOwnedQuotes(quoteIDs) {
  const url = process.env.NEXT_PUBLIC_FILTER_OWNER_OWNED_QUOTES_URL;
  const apiKey = process.env.NEXT_PUBLIC_FILTER_OWNER_OWNED_QUOTES_KEY;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quoteIDs }),
  });

  if (!response.ok) {
    throw new Error('Failed to get Quotes');
  }

  const data = await response.json(); 
  return data;
}

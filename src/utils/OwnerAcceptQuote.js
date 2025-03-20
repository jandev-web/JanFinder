import makeQuotePDF from '@/utils/generateQuoteDoc'
import acceptQuoteOwnerEmail from '@/utils/OwnerAcceptEmail'
export const acceptQuoteOwner = async (quoteID, franchiseID, ownerID) => {
    const url = process.env.NEXT_PUBLIC_OWNER_ACCEPT_QUOTE_URL;
    const apiKey = process.env.NEXT_PUBLIC_OWNER_ACCEPT_QUOTE_KEY;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quoteID, franchiseID, ownerID }),
    });

    if (!response.ok) {
        throw new Error('Failed to accept Quote');
    }
    



    return response.json();
};

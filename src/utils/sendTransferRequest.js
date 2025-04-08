export default async function sendTransferRequest(quoteID, cboID, ownerID) {
    const url = process.env.NEXT_PUBLIC_OWNER_SELL_QUOTE_URL;
    const apiKey = process.env.NEXT_PUBLIC_OWNER_SELL_QUOTE_KEY;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quoteID, cboID, ownerID }),
    });

    console.log(response)

    if (!response.ok) {
        throw new Error('Failed to accept Quote');
    }
    



    return response.json();
};

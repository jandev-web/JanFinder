const acceptQuoteOwnerEmail = async (quoteID) => {
    const url = process.env.NEXT_PUBLIC_OWNER_ACCEPT_EMAIL_URL;
    const apiKey = process.env.NEXT_PUBLIC_OWNER_ACCEPT_EMAIL_KEY; 
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ quoteID }),
    });

    if (!response.ok) {
        throw new Error('Failed to send email');
    }

    return response.json();
};
export default acceptQuoteOwnerEmail
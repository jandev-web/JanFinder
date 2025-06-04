const confirmSiteVerification = async ({ hasChanged, newRoomTypes, quoteID, userID }) => {
    const apiKey = process.env.NEXT_PUBLIC_CONFIRM_SITE_KEY;
    const url = process.env.NEXT_PUBLIC_CONFIRM_SITE_URL;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ hasChanged, newRoomTypes, quoteID, userID }),
        });

        if (!response.ok) {
            throw new Error('Payment request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error making payment request:', error);
        return null;
    }
};

export default confirmSiteVerification;

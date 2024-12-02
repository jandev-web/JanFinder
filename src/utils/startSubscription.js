const startSubscription = async ({ userID }) => {
    const apiKey = process.env.NEXT_PUBLIC_START_SUBSCRIPTION_KEY;
    const url = process.env.NEXT_PUBLIC_START_SUBSCRIPTION_URL;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount, quoteID, userID }),
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

export default makePayment;

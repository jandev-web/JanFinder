const getSubscription = async ({ userID }) => {
    const apiKey = process.env.NEXT_PUBLIC_GET_SUBSCRIPTION_KEY;
    const url = process.env.NEXT_PUBLIC_GET_SUBSCRIPTION_URL;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID }),
        });

        if (!response.ok) {
            throw new Error('Get Subscription request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting subscription:', error);
        return null;
    }
};

export default getSubscription;

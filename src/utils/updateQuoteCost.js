const updateQuoteCost = async (quoteID, costInfo) => {
    const apiKey = process.env.NEXT_PUBLIC_UPDATE_COST_KEY;
    console.log(apiKey)
    const url = process.env.NEXT_PUBLIC_UPDATE_COST_URL;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quoteID, costInfo })
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('API responded with error:', errorDetails);
            throw new Error(`Failed to get time: ${errorDetails.message}`);
        }

        const data = await response.json();
        console.log('Cost set successfully:', data);
        return data;
    } catch (error) {
        console.error('Error getting time:', error);
        throw new Error('An unexpected error occurred while getting time. Please try again later.');
    }
};
export default updateQuoteCost

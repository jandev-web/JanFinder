export const setSqftUtil = async (quoteID, sqft, budget) => {
    const apiKey = process.env.NEXT_PUBLIC_SET_SQFT_KEY;
    const url = process.env.NEXT_PUBLIC_SET_SQFT_URL;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quoteID, sqft, budget })
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('API responded with error:', errorDetails);
            throw new Error(`Failed to set sqft: ${errorDetails.message}`);
        }

        const data = await response.json();
        console.log('Sqft set successfully:', data);
        return data;
    } catch (error) {
        console.error('Error setting sqft:', error);
        throw new Error('An unexpected error occurred while setting sqft. Please try again later.');
    }
};

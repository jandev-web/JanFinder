const getQuoteStatus = async (email, confirmation) => {
    const url = process.env.NEXT_PUBLIC_GET_QUOTE_STATUS_URL;
    const apiKey = process.env.NEXT_PUBLIC_GET_QUOTE_STATUS_KEY; 
    
    try {
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, confirmation }),
        });

        if (response.status === 404) {
            // Quote not found
            return { notFound: true };
        }

        if (!response.ok) {
            // For non-200 or non-404 statuses, throw an error
            throw new Error('Failed to retrieve Status');
        }

        const data = await response.json();
        //console.log('Get Status Response: ', data);
        return { data }; // Return data wrapped in an object
    } catch (error) {
        console.error('Error retrieving Status:', error);
        return { error: true }; // Signal an error
    }
};

export default getQuoteStatus;


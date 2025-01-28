export const updateCostComponents = async (quoteID, componentInfo) => {
    const apiKey = process.env.NEXT_PUBLIC_UPDATE_COST_COMPONENTS_KEY;
    const url = process.env.NEXT_PUBLIC_UPDATE_COST_COMPONENTS_URL;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quoteID, componentInfo })
    });

    if (!response.ok) {
        throw new Error('Failed to get quotes');
    }
    
    return response.json();

};

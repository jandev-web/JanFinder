export const updatePackage = async (quoteID, packageInfo) => {
    const apiKey = process.env.NEXT_PUBLIC_UPDATE_PACKAGE_CHOICE_KEY;
    const url = process.env.NEXT_PUBLIC_UPDATE_PACKAGE_CHOICE_URL;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quoteID, packageInfo })
    });

    if (!response.ok) {
        throw new Error('Failed to get quotes');
    }
    
    return response.json();

};

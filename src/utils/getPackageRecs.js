
const getPackageRecs = async (quoteID) => {
    const url = process.env.NEXT_PUBLIC_PACKAGE_RECS_URL;
    const apiKey = process.env.NEXT_PUBLIC_PACKAGE_RECS_KEY; 
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ quoteID }),
    });

    if (!response.ok) {
        throw new Error('Failed to get packages');
    }
    
    return response.json();
};

export default getPackageRecs;

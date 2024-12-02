
const getFranchiseInfo = async (franchiseID) => {
    const url = process.env.NEXT_PUBLIC_GET_FRANCHISE_INFO_URL;
    const apiKey = process.env.NEXT_PUBLIC_GET_FRANCHISE_INFO_KEY; 
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ franchiseID }),
    });

    if (!response.ok) {
        throw new Error('Failed to get quotes');
    }
    
    return response.json();
};

export default getFranchiseInfo;

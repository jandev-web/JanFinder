
const getCBOQuotes = async (cboID, type) => {
    const url = process.env.NEXT_PUBLIC_GET_CBO_QUOTES_URL;
    const apiKey = process.env.NEXT_PUBLIC_GET_CBO_QUOTES_KEY; 
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ cboID, type }),
    });

    if (!response.ok) {
        throw new Error('Failed to get quotes');
    }
    
    return response.json();
};

export default getCBOQuotes;

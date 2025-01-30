
const getQuoteDetails = async (quoteID) => {
    const url = process.env.NEXT_PUBLIC_GET_QUOTE_DETAILS_URL;
    const apiKey = process.env.NEXT_PUBLIC_GET_QUOTE_DETAILS_KEY; 
    console.log(apiKey)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ quoteID }),
    });

    if (!response.ok) {
        throw new Error('Failed to get quotes');
    }
    
    return response.json();
};

export default getQuoteDetails;

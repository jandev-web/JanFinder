const getQuotePDF = async (quotePDF) => {
    const url = process.env.NEXT_PUBLIC_RETRIEVE_QUOTE_PDF_URL;
    const apiKey = process.env.NEXT_PUBLIC_RETRIEVE_QUOTE_PDF_KEY; 
    console.log("The quotePDF is:", quotePDF)
    console.log("The url is:", url)
    console.log("The apiKey is:", apiKey)
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({ quotePDF }),
        });

        if (!response.ok) {
            throw new Error('Failed to retrieve PDF');
        }

        const data = await response.json();
        console.log('Get PDF Response: ', data)
        return data.url;
    } catch (error) {
        console.error('Error retrieving PDF:', error);
        return null;
    }
};

export default getQuotePDF;

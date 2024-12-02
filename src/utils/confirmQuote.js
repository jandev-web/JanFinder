export default async function confirmQuote(id) {
    const url = process.env.NEXT_PUBLIC_CONFIRM_QUOTE_URL;
    const apiKey = process.env.NEXT_PUBLIC_CONFIRM_QUOTE_KEY;
    try {
        const quoteID = id
        
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quoteID }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json(); 
        
        //console.log(data)
        return data; 
    } catch (error) {
        console.error('Error confirming Quote:', error);
        
    }
}
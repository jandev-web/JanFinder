export default async function fetchFilteredQuotes(id) {
    const url = process.env.NEXT_PUBLIC_GET_FILTERED_OWNER_QUOTES_URL;
    const apiKey = process.env.NEXT_PUBLIC_GET_FILTERED_OWNER_QUOTES_KEY;
    try {
        const OwnerID = id
        
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ OwnerID }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json(); 
        
        //console.log(data)
        return data; 
    } catch (error) {
        console.error('Error fetching Quotes:', error);
        return []; // Return an empty array or handle the error as needed
    }
}
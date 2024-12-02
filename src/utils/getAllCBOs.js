export default async function fetchAllCBOs(id) {
    const url = process.env.NEXT_PUBLIC_GET_CBOS_URL;
    const apiKey = process.env.NEXT_PUBLIC_GET_CBOS_KEY;
    try {
        //console.log("URL: ", url)
        //console.log("Key: ", apiKey)
        //console.log("Email: ", email)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json(); 
        //console.log('A:')
        //console.log(data)
        return data; // This should be the list of CBOs
    } catch (error) {
        console.error('Error fetching CBOs:', error);
        return []; // Return an empty array or handle the error as needed
    }
}

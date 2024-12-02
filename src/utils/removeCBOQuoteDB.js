export default async function deleteCBOQuoteID(id) {
    const apiKey = process.env.NEXT_PUBLIC_REMOVE_CBOID_QUOTE_KEY;
    const url = process.env.NEXT_PUBLIC_REMOVE_CBOID_QUOTE_URL;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id
        })
      });
      console.log('Response: ', response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error removing CBO ID from Quote:', error);
      return null;
    }
  }
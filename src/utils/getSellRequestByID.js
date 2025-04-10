
export default async function fetchSellRequestByID(sellRequestID) {
    const apiKey = process.env.NEXT_PUBLIC_GET_SELL_REQUEST_KEY;
    const url = process.env.NEXT_PUBLIC_GET_SELL_REQUEST_URL;
    //console.log(id)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sellRequestID
        })
      });
      //console.log('Response: ', response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Error fetching Request by ID:', error);
      return null;
    }
  }
  
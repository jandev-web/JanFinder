async function getQuote(quoteRequest) {
    const apiKey = process.env.NEXT_PUBLIC_QUOTE_CALC_KEY;
    const url = process.env.NEXT_PUBLIC_QUOTE_CALC_URL;
  
    console.log('API Key:', apiKey);
    console.log('URL:', url);
    console.log('Request Data:', quoteRequest);
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quoteRequest
        })
      });
  
      if (!response.ok) {
        throw new Error(`Error! ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Response Data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  
  export default getQuote;
  
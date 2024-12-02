async function addToDb(clientInfo) {
    const apiKey = import.meta.env.VITE_PACKAGE_API_KEY;
    const url = import.meta.env.VITE_PACKAGE_API;
  

    //console.log('Request Data:', packageRequest);
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientInfo
        })
      });
  
      if (!response.ok) {
        throw new Error(`Error! ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  
export default addToDb;
  
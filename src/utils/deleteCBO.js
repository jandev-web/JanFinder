const deleteCBO = async (cboID) => {
    const apiKey = process.env.NEXT_PUBLIC_DELETE_CBO_KEY;
    const url = process.env.NEXT_PUBLIC_DELETE_CBO_URL;
  
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "cboID" :cboID
        })
      });
  
      if (!response.ok) {
        throw new Error(`Error! ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  
  export default deleteCBO;
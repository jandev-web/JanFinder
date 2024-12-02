export const getCBOBuildingTypes = async () => {
    
    const apiKey = process.env.NEXT_PUBLIC_GET_CBO_BUILDINGS_KEY;
    const url = process.env.NEXT_PUBLIC_GET_CBO_BUILDINGS_URL;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify()
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Failed to get data: ${errorDetails.message}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error getting data:', error);
      throw new Error('An unexpected error occurred while getting facilities. Please try again later.');
    }
  };
  

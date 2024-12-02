export const getFacilityOptions = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GET_FACILITY_OPTIONS_KEY;
    const url = process.env.NEXT_PUBLIC_GET_FACILITY_OPTIONS_URL;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        }
        
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Failed to create quote: ${errorDetails.message}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error creating quote:', error);
      throw new Error('An unexpected error occurred while getting options. Please try again later.');
    }
  };
  
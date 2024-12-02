const updateOwnerInfo = async (id, attributes) => {
    const apiKey = process.env.NEXT_PUBLIC_UPDATE_OWNER_INFO_KEY;
    const url = process.env.NEXT_PUBLIC_UPDATE_OWNER_INFO_URL;
  
    console.log("The ID is:", id);
  
    if (!apiKey || !url) {
      console.error('API key or URL is missing.');
      throw new Error('API key or URL is missing.');
    }
  
    
    try {
     
      const payload = {
        id,
        attributes              
      };
      console.log('Payload: ', payload)
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      // Check if response is okay
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Failed to update Info: ${errorDetails.message}`);
      }
  
      console.log('Info updated successfully');
      const data = await response.json(); 
      return data 
    } catch (error) {
      console.error('Error uploading picture:', error);
      throw new Error('An unexpected error occurred while uploading the picture. Please try again later.');
    }
  };
  export default updateOwnerInfo
export const uploadCBOBuildingData = async (buildingInfo) => {
    
    const apiKey = process.env.NEXT_PUBLIC_UPLOAD_CBO_BUILDING_DATA_KEY;
    const url = process.env.NEXT_PUBLIC_UPLOAD_CBO_BUILDING_DATA_URL;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(buildingInfo)
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Failed to upload data: ${errorDetails.message}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error uploading data:', error);
      throw new Error('An unexpected error occurred while uploading data. Please try again later.');
    }
  };
  

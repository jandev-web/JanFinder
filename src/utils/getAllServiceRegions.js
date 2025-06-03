const getAllRegions = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GET_ALL_REGIONS_KEY;
    const url = process.env.NEXT_PUBLIC_GET_ALL_REGIONS_URL;
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        }),
      });
      
  
      const data = await response.json();
      console.log(data)
      if (data.error) {
        const errorMessage = data.error
        let newMessage = errorMessage.split(":");
        newMessage = newMessage.length > 1 ? newMessage[1].trim() : '';
        throw new Error(newMessage)
        
      }
      return data;
    } catch (error) {
      
      throw new Error(error.message); // Return or re-throw the error so it can be handled in the form
    }
  };
  
  export default getAllRegions;
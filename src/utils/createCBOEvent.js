const createCBOEvent = async (eventType, CBOID, FranchiseID, QuoteID) => {
    const apiKey = process.env.NEXT_PUBLIC_CREATE_CBO_EVENT_KEY;
    const url = process.env.NEXT_PUBLIC_CREATE_CBO_EVENT_URL;
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,   // Correctly passing as key-value pairs
          CBOID,
          FranchiseID,
          QuoteID
        }),
      });
  
      const data = await response.json();
      console.log(data);
      if (data.error) {
        const errorMessage = data.error;
        let newMessage = errorMessage.split(":");
        newMessage = newMessage.length > 1 ? newMessage[1].trim() : '';
        throw new Error(newMessage);
      }
      return data;
    } catch (error) {
      throw new Error(error.message); // Return or re-throw the error so it can be handled in the form
    }
  };
  
  export default createCBOEvent;
  
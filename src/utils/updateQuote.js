export const updateQuote = async (quoteID, quoteInfo) => {
    const apiKey = process.env.NEXT_PUBLIC_UPDATE_QUOTE_KEY;
    const url = process.env.NEXT_PUBLIC_UPDATE_QUOTE_URL;
  
    const payload = {
      quoteID,
      quoteInfo
    };

    console.log(payload)
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Failed to update quote: ${errorDetails.message}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error updating quote:', error);
      throw new Error('An unexpected error occurred while updating the quote. Please try again later.');
    }
  };
  
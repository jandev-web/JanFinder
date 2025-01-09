export const updateCustomerInfo = async (quoteID, firstName, lastName, email, phone) => {
    
  
    const customerInfo = { firstName, lastName, email, phone };
    const apiKey = process.env.NEXT_PUBLIC_MEM_UPDATE_CUS_INFO_KEY;
    const url = process.env.NEXT_PUBLIC_MEM_UPDATE_CUS_INFO_URL;
    console.log(customerInfo)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({quoteID, customerInfo})
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Failed to create quote: ${errorDetails.message}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error creating quote:', error);
      throw new Error('An unexpected error occurred while creating the quote. Please try again later.');
    }
  };
  

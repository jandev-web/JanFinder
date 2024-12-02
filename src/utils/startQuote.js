export const startQuote = async (firstName, lastName, email, phone, company, address, confirmed, facilityType, franchise, cbo, memberMade) => {
    console.log('startQuote function called');
    console.log('firstName: ', firstName);
    console.log('confirmed: ', confirmed);
    console.log('cbo: ', cbo);
  
    const customerInfo = { firstName, lastName, email, phone, company, address, confirmed, facilityType, franchise, cbo, memberMade };
    const apiKey = process.env.NEXT_PUBLIC_START_QUOTE_KEY;
    const url = process.env.NEXT_PUBLIC_START_QUOTE_URL;
    console.log(customerInfo)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerInfo)
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
  

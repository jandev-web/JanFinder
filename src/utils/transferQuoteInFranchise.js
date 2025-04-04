export default async function transferQuoteInFranchise(ownerID, quoteID, newOwnerID) {
    const apiKey = process.env.NEXT_PUBLIC_TRANSFER_QUOTE_FRANCHISE_KEY;
    const url = process.env.NEXT_PUBLIC_TRANSFER_QUOTE_FRANCHISE_URL;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ownerID, quoteID, newOwnerID })
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
  

export default async function getOwnerByFranchise(franchiseID) {
    const apiKey = process.env.NEXT_PUBLIC_GET_OWNER_BY_FRANCHISE_KEY;
    const url = process.env.NEXT_PUBLIC_GET_OWNER_BY_FRANCHISE_URL;
    
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ franchiseID })
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
  

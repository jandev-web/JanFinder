export default async function updateFranchiseName(franchiseID, franchiseName) {
    const apiKey = process.env.NEXT_PUBLIC_UPDATE_FRANCHISE_NAME_KEY;
    const url = process.env.NEXT_PUBLIC_UPDATE_FRANCHISE_NAME_URL;
    console.log(url)
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ franchiseID, franchiseName })
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
  

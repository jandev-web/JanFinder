export default async function deleteFranchise(ID) {
    const apiKey = process.env.NEXT_PUBLIC_DELETE_FRANCHISE_KEY;
    const url = process.env.NEXT_PUBLIC_DELETE_FRANCHISE_URL;
  
    console.log(ID)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ID })
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
  

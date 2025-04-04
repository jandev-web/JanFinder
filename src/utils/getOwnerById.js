
export default async function fetchOwnerById(id) {
    const apiKey = process.env.NEXT_PUBLIC_GET_SINGLE_OWNER_KEY;
    const url = process.env.NEXT_PUBLIC_GET_SINGLE_OWNER_URL;
    //console.log(id)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id
        })
      });
      //console.log('Response: ', response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Owner by ID:', error);
      return null;
    }
  }
  
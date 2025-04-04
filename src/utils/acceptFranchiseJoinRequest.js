export default async function denyRequest(requestID, ownerID) {
    const apiKey = process.env.NEXT_PUBLIC_ANSWER_REQUEST_KEY;
    const url = process.env.NEXT_PUBLIC_ANSWER_REQUEST_URL;
    console.log(requestID);
    const action = 'accept';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestID, action, ownerID })
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
  

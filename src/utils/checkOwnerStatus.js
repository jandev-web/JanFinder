const checkUserRole = async (ID) => {
    const url = process.env.NEXT_PUBLIC_CHECK_IF_OWNER_URL;
    const apiKey = process.env.NEXT_PUBLIC_CHECK_IF_OWNER_KEY; 
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({ ID }),
        });
  
      const data = await response.json();
      console.log('Ownership status is ', data.exists)
      return data.exists; // Assuming Lambda returns { exists: true/false }
    } catch (error) {
      console.error('Error checking user role:', error);
      return false; // Default to CBOComponent if there's an error
    }
  };

export default checkUserRole;
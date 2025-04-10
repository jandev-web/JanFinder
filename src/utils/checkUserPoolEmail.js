
const checkUserPoolEmail = async (email) => {
    const url = process.env.NEXT_PUBLIC_CHECK_USER_POOL_EMAIL_URL;
    const apiKey = process.env.NEXT_PUBLIC_CHECK_USER_POOL_EMAIL_KEY; 

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error('Failed to get quotes');
    }
    
    return response.json();
};

export default checkUserPoolEmail;

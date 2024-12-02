export default async function getProfilePic(id) {
    const apiKey = process.env.NEXT_PUBLIC_GET_PROFILE_KEY;
    const url = process.env.NEXT_PUBLIC_GET_PROFILE_URL;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Get Pic Response: ', data)
        return data.url;
    } catch (error) {
        console.error('Error fetching Profile Pic by ID:', error);
        return null;
    }
}

export const setSelectedRooms = async (quoteID, facilityType) => {
    const apiKey = process.env.NEXT_PUBLIC_SET_SELECTED_ROOMS_KEY;
    const url = process.env.NEXT_PUBLIC_SET_SELECTED_ROOMS_URL;
    console.log(quoteID)
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quoteID, facilityType })
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('API responded with error:', errorDetails);
            throw new Error(`Failed to set rooms: ${errorDetails.message}`);
        }

        const data = await response.json();
        console.log('Rooms set successfully:', data);
        return data;
    } catch (error) {
        console.error('Error setting rooms:', error);
        throw new Error('An unexpected error occurred while setting rooms. Please try again later.');
    }
};

export const changeFacilityType = async (quoteID, facilityType) => {
    const apiKey = process.env.NEXT_PUBLIC_CHANGE_FACILITY_TYPE_KEY;
    const url = process.env.NEXT_PUBLIC_CHANGE_FACILITY_TYPE_URL;
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
            throw new Error(`Failed to change facility type: ${errorDetails.message}`);
        }

        const data = await response.json();
        console.log('Facility type changed successfully:', data);
        return data;
    } catch (error) {
        console.error('Error changing facility type:', error);
        throw new Error('An unexpected error occurred while changing facility type. Please try again later.');
    }
};

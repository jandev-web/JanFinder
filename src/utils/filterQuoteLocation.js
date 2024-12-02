import getQuoteDistance from '@/utils/getQuoteDistance'

const filterQuotesByDistance = async (quotes, userAddress, range) => {
    try {
        //console.log("User address:", userAddress);
        // Geocode the user's address
        

        const nearbyQuotes = [];
        for (const quote of quotes) {
            try {
                //console.log("Processing quote:", quote);
                const distance = await getQuoteDistance(quote, userAddress, range)

                if (distance <= range) {
                    nearbyQuotes.push(quote);
                }
            } catch (error) {
                console.error("Error processing quote:", quote, error);
            }
        }

        return nearbyQuotes;
    } catch (error) {
        console.error("Error filtering quotes by distance:", error);
        return [];
    }
};
export default filterQuotesByDistance
/**
 * Geocode an address to get latitude and longitude.
 * @param {Object} address - Address object with street, city, state, country, postalCode fields.
 * @returns {Promise<{latitude: number, longitude: number}>} - Geocoded latitude and longitude.
 */

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const R = 3958.8; // Radius of Earth in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const geocodeAddress = async (address) => {
    //console.log("Geocoding address:", address);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const { street, city, state, country, postalCode } = address;
    const addressString = `${street}, ${city}, ${state}, ${country}, ${postalCode}`;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${apiKey}`;

    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        //console.log(`Coordinates for ${addressString}:`, { lat, lng });
        return { latitude: lat, longitude: lng };
    } else {
        console.error("Geocoding failed for address:", addressString, data);
        throw new Error(`Geocoding failed for ${addressString}. Status: ${data.status}`);
    }
};

/**
 * Filters quotes by checking if they are within a given range from the user's location.
 * @param {Array} quotes - Array of quote objects with address fields.
 * @param {Object} userAddress - User's address with street, city, state, country, and postalCode.
 * @param {number} range - Range in miles to filter quotes.
 * @returns {Promise<Array>} - Quotes within the specified range.
 */
const getQuoteDistance = async (quote, userAddress, range) => {
    try {
        //console.log("User address:", userAddress);
        // Geocode the user's address
        const userCoordinates = await geocodeAddress(userAddress);
        try {
            //console.log("Processing quote:", quote);
            const quoteCoordinates = await geocodeAddress(quote.customerData.address);
            const distance = haversineDistance(
                userCoordinates.latitude,
                userCoordinates.longitude,
                quoteCoordinates.latitude,
                quoteCoordinates.longitude
            );

            //console.log(`Distance from user to quote ${quote.id}:`, distance, "miles");
            return distance

        } catch (error) {
            console.error("Error processing quote:", quote, error);
        }
    }


    catch (error) {
        console.error("Error filtering quotes by distance:", error);
    }
};
export default getQuoteDistance
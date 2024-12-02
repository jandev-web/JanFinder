import createCBOEvent from '@/utils/createCBOEvent'

export const acceptQuote = async (quoteID, franchiseID, cboID) => {
    const url = process.env.NEXT_PUBLIC_CBO_ACCEPT_QUOTE_URL;
    const apiKey = process.env.NEXT_PUBLIC_CBO_ACCEPT_QUOTE_KEY; 
    console.log("FranchiseID: ", franchiseID);
    const eventType = 'acceptedQuote'
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ quoteID, franchiseID, cboID }),
    });

    if (!response.ok) {
        throw new Error('Failed to accept Quote');
    }
    else {
        createCBOEvent(eventType, cboID, franchiseID, quoteID)
    }

    return response.json();
};

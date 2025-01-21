const makeQuotePDF = async (quoteID, franchiseID) => {
    const apiKey = process.env.NEXT_PUBLIC_RETRIEVE_QUOTE_PDF_KEY;
    const url = process.env.NEXT_PUBLIC_RETRIEVE_QUOTE_PDF_URL;


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quoteID, franchiseID }),
        });

        // Check if response is okay
        const data = await response.json();
        if (data.signedURL) {
            // Automatically trigger download
            const link = document.createElement('a');
            link.href = data.signedURL;
            link.download = `quote_${quoteID}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }


    } catch (error) {
        console.error('Error generating quote:', error);
        throw new Error('An unexpected error occurred while generating the quote. Please try again later.');
    }
};
export default makeQuotePDF
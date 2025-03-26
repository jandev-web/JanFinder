export default async function updateFranchisePDFName(franchiseID, pdfName, template_type) {
    const apiKey = process.env.NEXT_PUBLIC_UPDATE_FRANCHISE_PDF_NAME_KEY;
    const url = process.env.NEXT_PUBLIC_UPDATE_FRANCHISE_PDF_NAME_URL;
    
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ franchiseID, pdfName, template_type })
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
  

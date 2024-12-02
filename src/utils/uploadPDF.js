export const uploadPDF = async (quoteID, pdfFile) => {
  const apiKey = process.env.NEXT_PUBLIC_UPLOAD_PDF_KEY;
  const url = process.env.NEXT_PUBLIC_UPLOAD_PDF_URL;
  console.log("The quoteID is:", quoteID)
  if (!apiKey || !url) {
    console.error('API key or URL is missing.');
    throw new Error('API key or URL is missing.');
  }

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  try {
    const pdfBase64 = await readFileAsBase64(pdfFile);
    const payload = {
      quoteID,
      quotePDF: pdfBase64,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Failed to upload PDF: ${errorDetails.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw new Error('An unexpected error occurred while uploading the PDF. Please try again later.');
  }
};

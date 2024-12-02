const uploadPic = async (ID, pic) => {
    const apiKey = process.env.NEXT_PUBLIC_UPLOAD_PROFILE_KEY;
    const url = process.env.NEXT_PUBLIC_UPLOAD_PROFILE_URL;
  
    console.log("The ID is:", ID);
  
    if (!apiKey || !url) {
      console.error('API key or URL is missing.');
      throw new Error('API key or URL is missing.');
    }
  
    // Helper function to read the file as base64
    const readFileAsBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // Get base64 part
        reader.onerror = reject;
        reader.readAsDataURL(file); // Converts file to base64
      });
    };
  
    try {
      // Convert image file to base64
      const picBase64 = await readFileAsBase64(pic);
  
      // Payload to be sent to the API
      const payload = {
        ID,              // Use the ID as the identifier
        image: picBase64, // Base64 encoded image
      };
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      // Check if response is okay
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Failed to upload picture: ${errorDetails.message}`);
      }
  
      console.log('Profile picture uploaded successfully');
      return await response.json(); // Return the API response
    } catch (error) {
      console.error('Error uploading picture:', error);
      throw new Error('An unexpected error occurred while uploading the picture. Please try again later.');
    }
  };
  export default uploadPic
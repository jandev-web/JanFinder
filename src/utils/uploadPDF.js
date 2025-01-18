import { Storage } from 'aws-amplify';

export const uploadPDFTemplate = async (franchiseID, file) => {
  try {
    console.log(file)
    const fileName = `${franchiseID}/template`; // Organize files by userID
    const result = await Storage.put(fileName, file, {
      contentType: file.type, // Ensure correct content type
    });

    console.log('Upload successful:', result);
    alert('File uploaded successfully!');
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('Failed to upload file. Please try again.');
  }
};
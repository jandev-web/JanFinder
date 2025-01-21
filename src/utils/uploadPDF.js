import { uploadData } from "aws-amplify/storage";

export const uploadPDFTemplate = async (franchiseID, file, user) => {
  try {
    console.log(user)
    const fileName = `contract-templates/${franchiseID}/template.docx`;
    const arrayBuffer = await file.arrayBuffer();

    // Upload the file using Amplify's uploadData method
    const result = await uploadData({
      data: arrayBuffer,
      path: fileName
    });
   

    console.log('Upload successful:', result);
    alert('File uploaded successfully!');

  } catch (error) {
    console.error('Error uploading file:', error);
    alert('Failed to upload file. Please try again.');
  }
}




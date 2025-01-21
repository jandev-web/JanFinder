'use client'

import React, { useState } from 'react';
import { uploadPDFTemplate } from '@/utils/uploadPDF';
import { FileUploader } from '@aws-amplify/ui-react-storage';



interface UploadPDFProps {
  franchiseID: string;
  user: any;
}

const UploadFranchisePDFTemplate: React.FC<UploadPDFProps> = ({ franchiseID, user }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const fileName = `contract-templates/${franchiseID}/template.docx`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Get file size in bytes
      const fileSizeInBytes = file.size;

      // Convert size to MB for easier readability
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

      const MAX_SIZE_MB = 10; // 10 MB
      if (fileSizeInMB > MAX_SIZE_MB) {
        alert(`File is too large. Maximum size allowed is ${MAX_SIZE_MB} MB.`);
        return;
      }

      setFileSize(fileSizeInMB);
      console.log(`File size: ${fileSizeInBytes} bytes (${fileSizeInMB.toFixed(2)} MB)`);

      // Set the file if size is valid
      setFile(file);
    }
  };
  

  const handleUpload = async () => {
    if (!franchiseID) {
      alert('Please enter a user ID.');
      return;
    }

    if (!file) {
      alert('Please select a file.');
      return;
    }

    await uploadPDFTemplate(franchiseID, file, user);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Upload Franchise PDF Template</h2>
      
      <FileUploader
        acceptedFileTypes={['.docx']}
        path={fileName}
        maxFileCount={1}
        isResumable
        autoUpload={false}
        onUploadSuccess={() => alert('File uploaded successfully!')}
      />

      {file && (
        <div className="mt-4">
          <p>Selected File: <strong>{file.name}</strong></p>
          <p>Size: <strong>{fileSize.toFixed(2)} MB</strong></p>
        </div>
      )}

      <button
        onClick={handleUpload}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        
      </button>
    </div>
  );
};

export default UploadFranchisePDFTemplate;

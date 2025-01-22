'use client'

import React, { useState } from 'react';
import { uploadPDFTemplate } from '@/utils/uploadPDF';
import { FileUploader } from '@aws-amplify/ui-react-storage';



interface UploadPDFProps {
  franchiseID: string;
  user: any;
}

const UploadFranchisePDFTemplate: React.FC<UploadPDFProps> = ({ franchiseID, user }) => {
  
  const fileName = `public/contract-templates/${franchiseID}/`;
  console.log(user)
  const processFile = async ({ file }: { file: File }) => {
    return { file, key: `template.docx` };
  };
  
  

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Upload Franchise PDF Template</h2>
      
      <FileUploader
        acceptedFileTypes={['.docx']}
        path={fileName}
        processFile={processFile}
        maxFileCount={1}
        isResumable
        autoUpload={false}
        onUploadSuccess={() => alert('File uploaded successfully!')}
      />
      
    </div>
  );
};

export default UploadFranchisePDFTemplate;

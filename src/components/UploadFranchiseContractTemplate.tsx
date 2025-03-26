'use client'

import React, { useState } from 'react';
import updateFranchisePDFName from '@/utils/setFranchisePDFName';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { useRouter } from 'next/navigation';



interface UploadPDFProps {
  franchiseID: string;
  user: any;
}

const UploadFranchisePDFTemplate: React.FC<UploadPDFProps> = ({ franchiseID, user }) => {
  const router = useRouter();
  const template_type = 'contract'
  const fileName = `protected/contract-templates/${franchiseID}/`;
  console.log(user)
  const processFile = async ({ file }: { file: File }) => {
    updateFranchisePDFName(franchiseID, file.name, template_type)
    return { file, key: `contract-template.docx` };
  };



  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Upload Franchise Contract Template</h2>

      <FileUploader
        acceptedFileTypes={['.docx']}
        path={fileName}
        processFile={processFile}
        maxFileCount={1}
        isResumable
        autoUpload={false}
        onUploadSuccess={() => router.push('/members/owner/franchise')}
      />

    </div>
  );
};

export default UploadFranchisePDFTemplate;

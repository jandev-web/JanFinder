'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { uploadPDF } from '../utils/uploadPDF';
import createCBOEvent from '@/utils/createCBOEvent'
interface UploadPDFFormProps {
  quoteID: string;
}

const UploadPDFForm: React.FC<UploadPDFFormProps> = ({ quoteID }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  //console.log('quoteID:', quoteID);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pdfFile) {
      setErrorMessage('Please select a file to upload');
      return;
    }
    try {
      const result = await uploadPDF(quoteID, pdfFile);
      console.log('PDF uploaded successfully:', result);
      const eventResult = await createCBOEvent('quoteCreated', 'none', 'none', quoteID)
      setSuccessMessage('PDF uploaded successfully!');
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setErrorMessage('Failed to upload PDF');
      setSuccessMessage(''); // Clear any previous success messages
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Upload PDF:
        <input type="file" accept="application/pdf" onChange={handleFileChange} required />
      </label>
      <button type="submit">Upload PDF</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </form>
  );
};

export default UploadPDFForm;

// components/GeneratePDFForm.tsx
'use client';

import React from 'react';
import generatePDF from '../utils/generatePDF';

interface GeneratePDFFormProps {
  quoteDetails: any; // Define a more specific type if needed
}

const GeneratePDFForm: React.FC<GeneratePDFFormProps> = ({ quoteDetails }) => {
  const handleGeneratePDF = () => {
    generatePDF(quoteDetails);
  };

  return (
    <button onClick={handleGeneratePDF}>Download PDF</button>
  );
};

export default GeneratePDFForm;

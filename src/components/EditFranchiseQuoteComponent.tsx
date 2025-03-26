'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './loadingScreen';
import UploadFranchisePDFTemplate from './UploadFranchiseQuoteTemplate';

interface EditFranchiseQuoteComponentProps {
  franchise: any;
  user: any;
}

const EditFranchiseQuoteComponent: React.FC<EditFranchiseQuoteComponentProps> = ({ franchise, user }) => {
  const franchiseID = franchise?.FranchiseID;
  const [franchisePDF, setFranchisePDF] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // When the franchise prop updates, set the franchiseName and update loading.
  useEffect(() => {
    if (franchise?.franchiseName) {
      setFranchisePDF(franchise.contractTemplate);
      setLoading(false);
    }
    
  }, [franchise]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <p>Current Quote Template: {franchisePDF}</p>
      <UploadFranchisePDFTemplate franchiseID={franchiseID} user={user}/>
    </div>
  );
};

export default EditFranchiseQuoteComponent;

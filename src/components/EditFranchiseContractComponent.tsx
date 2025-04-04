'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './loadingScreen';
import UploadFranchisePDFTemplate from './UploadFranchiseContractTemplate';
import deleteFranchiseTemplate from '@/utils/deleteFranchiseTemplate';
import getContractTemplate from '@/utils/getContractTemplate';

interface EditFranchiseContractComponentProps {
  franchise: any;
  user: any;
}

const EditFranchiseContractComponent: React.FC<EditFranchiseContractComponentProps> = ({ franchise, user }) => {
  const franchiseID = franchise?.FranchiseID;
  const [franchisePDF, setFranchisePDF] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // When the franchise prop updates, set the franchiseName and update loading.
  useEffect(() => {
    if (franchise?.franchiseName) {

      setFranchisePDF(franchise.contractTemplate);
      setLoading(false);
    }
  }, [franchise]);


  const handleDeleteTemplate = async () => {
    setError('');
    setDeleteLoading(true);
    try {
      deleteFranchiseTemplate(franchiseID, 'contract');
      setFranchisePDF(null);
      router.push('/members/owner/franchise')
    } catch (err: any) {
      console.error("Error deleting template:", err);
      setError("Failed to delete template. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };
  
  const downloadContractTemplate = async () => {
    try {
      const contractTemplate = await getContractTemplate(franchise?.FranchiseID);

      const response = await fetch(contractTemplate.url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${franchise?.contractTemplate}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Failed to download PDF. Please try again later.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-10">
      {/* Header: Single line */}
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Edit Franchise Contract</h2>

      <div className="mb-8">
        {/* Label on its own line */}
        <p className="text-lg text-gray-700">Current Contract Template:</p>

        {franchisePDF !== 'none' ? (
          <div className="mt-2 flex items-center justify-between">
            {/* Template Name */}
            <span
              onClick={downloadContractTemplate}
              className="text-lg text-blue-600 cursor-pointer hover:underline"
            >
              {franchise?.contractTemplate}
            </span>
            {/* Download Button */}
            <button
              onClick={downloadContractTemplate}
              className="p-2 bg-gray-100 text-blue-700 rounded-full hover:bg-yellow-100 transition-colors focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                />
              </svg>
            </button>
          </div>
        ) : (
          <p className="mt-2 text-lg text-red-500">No contract template uploaded</p>
        )}

        {/* Delete Button (only visible if template exists) */}
        {franchisePDF !== 'none' && (
          <button
            onClick={handleDeleteTemplate}
            disabled={deleteLoading}
            className="w-full mt-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {deleteLoading ? "Deleting Template..." : "Delete Contract Template"}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <UploadFranchisePDFTemplate franchiseID={franchiseID} user={user} />
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
    </div>


  );
};

export default EditFranchiseContractComponent;

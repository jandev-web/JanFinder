import React, { useState, useEffect } from 'react';
import updateFranchiseName from '@/utils/updateFranchiseName';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './loadingScreen';

interface EditFranchiseNameComponentProps {
  franchise: any;
}

const EditFranchiseNameComponent: React.FC<EditFranchiseNameComponentProps> = ({ franchise }) => {
  const [franchiseName, setFranchiseName] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // When the franchise prop updates, set the franchiseName and update loading.
  useEffect(() => {
    if (franchise?.franchiseName) {
      setFranchiseName(franchise.franchiseName);
      setLoading(false);
    }
    
  }, [franchise]);

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await updateFranchiseName(franchise.FranchiseID, franchiseName);
      router.push('/members/owner/franchise');
    } catch (err) {
      console.error('Error updating franchise name:', err);
      setError('Failed to update franchise name. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-[#001F54] mb-4">Edit Franchise Name</h2>
      <input
        type="text"
        value={franchiseName}
        onChange={(e) => setFranchiseName(e.target.value)}
        className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {/* Only show the button if not loading and if the name has changed */}
      {!loading && franchiseName !== franchise?.franchiseName && (
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full py-2 bg-yellow-500 text-[#001F54] font-semibold rounded hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Confirm'}
        </button>
      )}
    </div>
  );
};

export default EditFranchiseNameComponent;

'use client';

import React, { useEffect, useState } from 'react';
import fetchCBOById from '@/utils/getCBOByID';
import getFranchiseInfo from '@/utils/getFranchiseInfo'
interface CBO {
  CBOID: string;
  franchiseID: string;
}

interface CBOCardProps {
  cbo: CBO;
  onClick: () => void;
}

const CBOCard: React.FC<CBOCardProps> = ({ cbo, onClick }) => {
  const [CBOName, setCBOName] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [franchiseName, setFranchiseName] = useState('Loading...');

  useEffect(() => {
    const fetchCBOData = async () => {
      if (cbo) {
        try {
          const cboInfo = await fetchCBOById(cbo.CBOID);
          if (cboInfo && cboInfo.firstName) {
            setCBOName(`${cboInfo.firstName} ${cboInfo.lastName}`);
            const franInfo = await getFranchiseInfo(cbo.franchiseID)
            setFranchiseName(franInfo.franchiseName)
          } else {
            setCBOName('Unknown CBO');
          }
        } catch (error) {
          console.error('Error fetching CBO data:', error);
          setError('Error loading CBO information');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCBOData();
  }, [cbo]);

  return (
    <button
      onClick={onClick}
      className="w-full bg-white hover:bg-yellow-300 border border-gray-300 p-4 rounded-lg shadow-lg text-left transition duration-200 ease-in-out"
      disabled={loading || error !== null}
    >
      {loading ? (
        <p className="text-gray-500">Loading CBO...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-green-800">{CBOName}</h2>
          <p className="text-sm text-green-700">Franchise: {franchiseName}</p>
        </>
      )}
    </button>
  );
};

export default CBOCard;

import React, { useState } from 'react';
import checkFranchiseAccountNumber from '@/utils/checkFranchiseAccountNumber';
import RequestFranchiseFound from '@/components/RequestFranchiseFound';
import RequestFranchiseNotFound from '@/components/RequestFranchiseNotFound';
import RequestJoinFranchiseInput from '../RequestFranchiseInput';

const RequestJoinFranchise: React.FC = () => {
  const [franchiseAccountNumber, setFranchiseAccountNumber] = useState('');
  const [franchise, setFranchise] = useState<any>(null);
  const [isFranchise, setIsFranchise] = useState<any>(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (accountNumber: string) => {
    setError('');
    setLoading(true);
    setSubmitted(false);
    try {
      const result = await checkFranchiseAccountNumber(accountNumber);
      setIsFranchise(result.isFranchise);
      setFranchise(result.franchise);
    } catch (err: any) {
      setError('Error checking Franchise Account Number: ' + err.message);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  // Called when the user clicks "Go Back" in the not-found component.
  const handleGoBack = () => {
    setSubmitted(false);
    setFranchise(null);
    setFranchiseAccountNumber('');
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (submitted) {
    if (isFranchise) {
      return <RequestFranchiseFound franchise={franchise} />;
    } else {
      return (
        <RequestFranchiseNotFound
          franchiseAccountNumber={franchiseAccountNumber}
          onGoBack={handleGoBack}
        />
      );
    }
  }

  return (
    <div>
      <RequestJoinFranchiseInput
        franchiseAccountNumber={franchiseAccountNumber}
        setFranchiseAccountNumber={setFranchiseAccountNumber}
        onSubmit={handleSubmit}
        error={error}
      />
    </div>
  );
};

export default RequestJoinFranchise;

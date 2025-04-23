'use client';

import React, { useEffect, useState } from 'react';
import QuoteForm from '../QuoteForm';
import LoadingSpinner from '@/components/loadingScreen';

interface BuildingType {
  name: string;
}

interface QuoteFormProps {
  quoteID: any;
  facilityType: any;
  facilityOptions: BuildingType[];
  onNextStep: (stepNumber: number) => void;
  onMoveOn: (moveOn: boolean) => void;
  onChangeInfo: (newInfo: any) => void;
  onCanClick: (step: any, canClick: boolean) => void;
}

const Quote: React.FC<QuoteFormProps> = ({ onCanClick, quoteID, facilityType, facilityOptions, onNextStep, onMoveOn, onChangeInfo }) => {
  const [loading, setLoading] = useState(false);

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading);
}

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>

      {/* Message About the First Step */}
      <div className="bg-[#001F54] text-white p-8 rounded-md shadow-lg max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Step 2: Facility Type</h1>
        <p className="text-xl">
          Next, please select which type of facility you are looking for a quote for.
        </p>
      </div>

      {/* Form Section */}
      
        <QuoteForm quoteID={quoteID} onCanClick={onCanClick} facilityOptions={facilityOptions} facilityType={facilityType} onNextStep={onNextStep} onMoveOn={onMoveOn} onChangeInfo={onChangeInfo} onLoading={handleLoading}/>;
      
    </div>

  );
};

export default Quote;

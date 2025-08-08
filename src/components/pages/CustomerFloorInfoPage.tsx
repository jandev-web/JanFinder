'use client';

import React, { useEffect, useState } from 'react';
import FloorNumber from '@/components/FloorNumber'
import LoadingSpinner from '@/components/loadingScreen';

interface QuoteFormProps {
  quoteID: any;
  floorNumber: any;
  stairwells:any;
  onNextStep: (stepNumber: number) => void;
  onMoveOn: (moveOn: boolean) => void;
  onChangeFloors: (newFloorNumber: any, newStairwells: any) => void;
  onCanClick: (step: any, canClick: boolean) => void;
}

const FloorInfoPage: React.FC<QuoteFormProps> = ({ onCanClick, quoteID, stairwells, floorNumber, onNextStep, onMoveOn, onChangeFloors }) => {
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
        <h1 className="text-4xl font-bold mb-4">Step 2: Number of Floors</h1>
        <p className="text-xl">
          Next, add your Facility&apos; floor number and stairwell information.
        </p>
      </div>

      {/* Form Section */}
      
        <FloorNumber quoteID={quoteID} onCanClick={onCanClick} floorNumber={floorNumber} stairwells={stairwells} onNextStep={onNextStep} onMoveOn={onMoveOn} onChangeInfo={onChangeFloors} onLoading={handleLoading}/>
      
    </div>

  );
};

export default FloorInfoPage;

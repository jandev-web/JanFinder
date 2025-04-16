'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';

import { changeFacilityType } from '@/utils/changeFacilityType';



// Define an interface for building types (adjust as needed)
interface BuildingType {
  name: string;
}

interface QuoteFormProps {
  quoteID: any;
  facilityType: any;
  facilityOptions: BuildingType[];
  onNextStep: (stepNumber: number) => void;
  onMoveOn: (moveOn: boolean) => void;
  onLoading: (isLoading: boolean) => void;
  onChangeInfo: (newInfo: any) => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ quoteID, facilityType, facilityOptions, onNextStep, onMoveOn, onChangeInfo, onLoading }) => {
  
  console.log(facilityType)
  const [newFacilityType, setNewFacilityType] = useState<any>(facilityType);

  useEffect(() => {
      if ((newFacilityType != facilityType) || (newFacilityType === '')) {
        console.log(newFacilityType)
        console.log(facilityType)
        onMoveOn(false);
      } else {
        console.log('Move On')
        console.log(newFacilityType != facilityType)
        console.log(newFacilityType === '')
        console.log(newFacilityType)
        console.log(facilityType)
        onMoveOn(true);
      }
    }, [newFacilityType]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLoading(true)
    onChangeInfo(newFacilityType)
    try {
      await changeFacilityType(quoteID, newFacilityType);
      onNextStep(2)
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  };

  

  return (
    <div className="bg-gradient-to-br from-white to-gray-200 p-10 rounded-xl shadow-2xl max-w-2xl w-full border border-yellow-500">

      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-2xl font-semibold text-[#001F54] border-b border-yellow-500 inline-block">
          Facility Type
        </h3>

        {/* Dropdown for selecting a facility type */}
        <div className="flex flex-col text-gray-700">
          <select
            name="facilityType"
            value={newFacilityType}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewFacilityType(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
          >
            <option value="" disabled>
              Select Facility Type
            </option>
            {facilityOptions.map((facility, index) => (
              <option key={index} value={facility.name}>
                {facility.name}
              </option>
            ))}
          </select>
        </div>

        {(newFacilityType != '' && newFacilityType != facilityType) && (
          <button
            type="submit"
            className="w-full py-4 bg-yellow-500 text-white font-extrabold text-xl rounded-md shadow-md hover:bg-[#001F54] transition duration-300"
          >
            Confirm Facility Type
          </button>
        )}
      </form>
    </div>
  );
};

export default QuoteForm;

'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';

import { changeFacilityType } from '@/utils/changeFacilityType';
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

const UpdateFacility: React.FC<QuoteFormProps> = ({ onCanClick, quoteID, facilityType, facilityOptions, onNextStep, onMoveOn, onChangeInfo }) => {
    const [loading, setLoading] = useState(false);
    const [newFacilityType, setNewFacilityType] = useState<any>(facilityType);
      console.log(facilityOptions)
      useEffect(() => {
          if ((newFacilityType != facilityType) || (newFacilityType === '')) {
            
            onMoveOn(false);
          } else {
            
            onMoveOn(true);
          }
        }, [newFacilityType]);
    
      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        onChangeInfo(newFacilityType)
        try {
          await changeFacilityType(quoteID, newFacilityType);
          onNextStep(3)
          onCanClick(3, true)
        } catch (error) {
          console.error('Error updating quote:', error);
        }
      };

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
                            {facilityOptions.map((facility: any, index: any) => (
                                <option key={index} value={facility}>
                                    {facility}
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

        </div>

    );
};

export default UpdateFacility;

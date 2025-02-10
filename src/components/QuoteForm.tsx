'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { changeFacilityType } from '@/utils/changeFacilityType';

import { getCBOBuildingTypes } from '@/utils/getCBOBuildingTypes';
import getQuoteDetails from '@/utils/getQuoteDetails';

// Define an interface for building types (adjust as needed)
interface BuildingType {
  name: string;
}

interface QuoteFormProps {
  quoteID: string;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ quoteID }) => {
  const [facilityType, setFacilityType] = useState('');
  const [facilityOptions, setFacilityOptions] = useState<BuildingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('Lucky Customer');
  const router = useRouter();

  useEffect(() => {
    const fetchFacilityOptions = async () => {
      try {
        const quoteData = await getQuoteDetails(quoteID);
        const buildingTypes = await getCBOBuildingTypes();
        console.log('Building Types:', buildingTypes);
        
        if (
          (quoteData.customerData?.firstName && quoteData.customerData.firstName !== '') ||
          (quoteData.customerData?.lastName && quoteData.customerData.lastName !== '')
        ) {
          const firstName = quoteData.customerData?.firstName || '';
          const lastName = quoteData.customerData?.lastName || '';
          const customerString = `${firstName} ${lastName}`.trim();
          setName(customerString);
        }
        
        // Ensure facilityOptions is an array
        setFacilityOptions(buildingTypes || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching facility options:', error);
      }
    };
    fetchFacilityOptions();
  }, [quoteID]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await changeFacilityType(quoteID, facilityType);
      router.push(`/get-a-quote/room-info`);
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  };

  if (loading) {
    return <p className="text-black">Loading...</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-400">Welcome, {name}!</h2>
        <p className="text-gray-700">
          Enter your facility information to get an accurate quote.
        </p>

        {/* Dropdown for selecting a facility type */}
        <div className="flex flex-col text-gray-700">
          <label className="block text-gray-700 font-semibold mb-2">Industry:</label>
          <select
            name="facilityType"
            value={facilityType}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFacilityType(e.target.value)}
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-yellow-500 transition duration-300"
        >
          Get Quote Price Now!
        </button>
      </form>
    </div>
  );
};

export default QuoteForm;

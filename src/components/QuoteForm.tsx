'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { updateQuote } from '../utils/updateQuote';
import { getFacilityOptions } from '@/utils/getFacilityOptions';
import getQuoteDetails from '@/utils/getQuoteDetails'
interface QuoteFormProps {
  quoteID: string;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ quoteID }) => {
  const [formData, setFormData] = useState({
    sqft: '',
    facilityType: '',
    selectedRooms: {} as Record<string, number>,
    budget: ''
  });

  const [facilityOptions, setFacilityOptions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('Lucky Customer')
  const router = useRouter();

  useEffect(() => {
    const fetchFacilityOptions = async () => {
      try {
        const options = await getFacilityOptions();
        const quoteData = await getQuoteDetails(quoteID)
        if ((quoteData.customerData?.firstName && quoteData.customerData?.firstName != '') || (quoteData.customerData?.lastName && quoteData.customerData?.firstName != '')) {
          let firstName = ''
          let lastName = ''
          if (quoteData.customerData?.firstName) {
            firstName = quoteData.customerData?.firstName
          }
          if (quoteData.customerData?.lastName) {
            lastName = quoteData.customerData?.lastName
          }
          const customerString = `${firstName} ${lastName}`
          setName(customerString)
        }

        setFacilityOptions(options);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching facility options:', error);
      }
    };
    fetchFacilityOptions();
  }, []);

  useEffect(() => {
    if (formData.facilityType && facilityOptions[formData.facilityType]) {
      const initialRooms = facilityOptions[formData.facilityType].reduce((acc, room) => {
        acc[room] = 1; // Set each room to 1 by default (checked)
        return acc;
      }, {} as Record<string, number>);
      setFormData((prevData) => ({
        ...prevData,
        selectedRooms: initialRooms,
      }));
    }
  }, [formData.facilityType, facilityOptions]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoomChange = (room: string) => {
    setFormData((prevData) => {
      const currentCount = prevData.selectedRooms[room] || 0;
      const newCount = currentCount === 0 ? 1 : 0; // Toggle between 1 and 0

      return {
        ...prevData,
        selectedRooms: {
          ...prevData.selectedRooms,
          [room]: newCount,
        },
      };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateQuote(quoteID, formData);
      const queryString = new URLSearchParams({
        quoteID,
      }).toString();
      router.push(`/packages?${queryString}`);
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-400">Welcome, {name}!</h2>
        <p className="text-gray-700">
          Enter your facility information to get an accurate quote.
        </p>

        {/* Square Footage */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Square Feet:</label>          <input
            type="number"
            name="sqft"
            value={formData.sqft}
            onChange={handleChange}
            required
            className="w-full p-3 text-[#001F54] border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
        </div>

        <div className="flex flex-col text-gray-700">
          <label className="block text-gray-700 font-semibold mb-2">Industry:</label>          <select
            name="facilityType"
            value={formData.facilityType}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
            >
            <option value="">What type of industry is your faciltity used for?</option>
            {Object.keys(facilityOptions).map((facility) => (
              <option key={facility} value={facility}>
                {facility.charAt(0).toUpperCase() + facility.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {formData.facilityType && facilityOptions[formData.facilityType] && (
          <div className="flex flex-col">
            <label className="block text-gray-700 font-semibold mb-2">Which of these rooms does your facility have?:</label>
            <p className='text-sm text-yellow-400 mb-2'>Deselect any rooms not present in your facility</p>            
            <div className="space-y-2">
              {facilityOptions[formData.facilityType].map((room) => (
                <div key={room} className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.selectedRooms[room] > 0}
                    onChange={() => handleRoomChange(room)}
                    className="mr-2"
                  />
                  <span>{room}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col text-gray-700">
        <label className="block text-gray-700 font-semibold mb-2">Your Budget:</label>          
        <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            className="w-full p-3 text-[#001F54] border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
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

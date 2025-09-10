'use client';

import { FacilityType, FACILITY_TYPES, ValidationErrors } from '../types';

interface FacilityTypeStepProps {
  facilityType: FacilityType | '';
  onChange: (type: FacilityType) => void;
  errors: ValidationErrors;
}

export default function FacilityTypeStep({ facilityType, onChange, errors }: FacilityTypeStepProps) {
  const facilityDescriptions: Record<FacilityType, string> = {
    'Office': 'Corporate offices, coworking spaces, administrative buildings',
    'Medical': 'Clinics, hospitals, dental offices, medical facilities',
    'Retail': 'Stores, showrooms, shopping centers, boutiques',
    'School': 'Educational facilities, universities, training centers',
    'Warehouse': 'Storage facilities, distribution centers, industrial spaces',
    'Restaurant': 'Restaurants, cafes, food service establishments',
    'Manufacturing': 'Production facilities, factories, assembly plants',
    'Other': 'Specialized facilities requiring custom cleaning solutions'
  };

  const facilityIcons: Record<FacilityType, string> = {
    'Office': '🏢',
    'Medical': '🏥',
    'Retail': '🏪',
    'School': '🏫',
    'Warehouse': '🏭',
    'Restaurant': '🍽️',
    'Manufacturing': '⚙️',
    'Other': '🏗️'
  };

  return (
    <div className="space-y-6">
      {errors.facilityType && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-600 text-sm font-medium">{errors.facilityType}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FACILITY_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`p-6 rounded-xl border-2 text-left transition-all duration-200 hover:border-[#F5C542] hover:bg-yellow-50 hover:shadow-md transform hover:-translate-y-1 ${
              facilityType === type
                ? 'border-[#F5C542] bg-yellow-50 ring-2 ring-[#F5C542] shadow-lg'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl flex-shrink-0">
                {facilityIcons[type]}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#001F54] text-lg mb-2">
                  {type}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {facilityDescriptions[type]}
                </p>
              </div>
              {facilityType === type && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-[#F5C542] flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 rounded-full bg-[#001F54] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-[#001F54] mb-2">Why This Matters</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Different facility types have unique cleaning requirements, regulations, and frequency needs. 
              This helps us provide specialized services and accurate pricing for your industry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
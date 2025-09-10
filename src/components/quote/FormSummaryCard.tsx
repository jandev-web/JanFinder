'use client';

import { QuoteInfo } from './types';

interface FormSummaryCardProps {
  data: QuoteInfo;
  currentStep: number;
}

export default function FormSummaryCard({ data, currentStep }: FormSummaryCardProps) {
  const formatCurrency = (amount: number) => {
    return amount ? `$${amount.toLocaleString()}` : 'Not set';
  };

  const formatFloorTypes = () => {
    if (data.floorTypePercentages) {
      return `${data.floorTypePercentages.hardfloor}% Hardfloor, ${data.floorTypePercentages.carpet}% Carpet`;
    }
    return 'Not set';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-[#001F54] mb-4 flex items-center">
        <div className="w-2 h-2 bg-[#F5C542] rounded-full mr-2"></div>
        Quote Summary
      </h3>
      
      <div className="space-y-4 text-sm">
        {/* Contact Info */}
        {currentStep > 1 && data.contact.firstName && (
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
            <div className="text-gray-600 space-y-1">
              <div>{data.contact.firstName} {data.contact.lastName}</div>
              <div>{data.contact.company}</div>
              <div>{data.contact.email}</div>
              <div>{data.contact.phone}</div>
            </div>
          </div>
        )}

        {/* Budget */}
        {currentStep > 2 && data.budget > 0 && (
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-medium text-gray-900 mb-2">Budget</h4>
            <div className="text-gray-600">
              {formatCurrency(data.budget)}/month
            </div>
          </div>
        )}

        {/* Facility Type */}
        {currentStep > 3 && data.facilityType && (
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-medium text-gray-900 mb-2">Facility</h4>
            <div className="text-gray-600">{data.facilityType}</div>
          </div>
        )}

        {/* Floors & Stairs */}
        {currentStep > 4 && data.floors > 0 && (
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-medium text-gray-900 mb-2">Layout</h4>
            <div className="text-gray-600 space-y-1">
              <div>{data.floors} floor{data.floors > 1 ? 's' : ''}</div>
              {data.stairwellsCarpeted > 0 && (
                <div>{data.stairwellsCarpeted} carpeted stairwell{data.stairwellsCarpeted > 1 ? 's' : ''}</div>
              )}
              {data.stairwellsHardfloor > 0 && (
                <div>{data.stairwellsHardfloor} hardfloor stairwell{data.stairwellsHardfloor > 1 ? 's' : ''}</div>
              )}
            </div>
          </div>
        )}

        {/* Square Footage */}
        {currentStep > 5 && data.sqft > 0 && (
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-medium text-gray-900 mb-2">Space</h4>
            <div className="text-gray-600 space-y-1">
              <div>{data.sqft.toLocaleString()} sq ft</div>
              <div>{formatFloorTypes()}</div>
            </div>
          </div>
        )}

        {/* Frequency */}
        {currentStep > 6 && data.frequency && (
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-medium text-gray-900 mb-2">Frequency</h4>
            <div className="text-gray-600">{data.frequency}</div>
          </div>
        )}

        {/* Package */}
        {currentStep > 7 && data.selectedPackage && (
          <div className="pb-3">
            <h4 className="font-medium text-gray-900 mb-2">Package</h4>
            <div className="text-gray-600">{data.selectedPackage}</div>
          </div>
        )}
      </div>

      {currentStep <= 2 && (
        <div className="text-gray-500 text-sm italic">
          Complete steps to see your quote summary
        </div>
      )}
    </div>
  );
}
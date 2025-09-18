'use client';

import { PACKAGE_DETAILS } from '@/types/package-details';

/** ---- Minimal UI-only types used by this component ---- */
type ReviewContact = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  address: string; // street
  city: string;
  state: string;
  postalCode: string;
};

type ReviewRoom = { roomType: string; count: number };

type ReviewData = {
  contact: ReviewContact;
  budget: number;
  facilityType: string;
  floors: number;
  stairwellsCarpeted: number;
  stairwellsHardfloor: number;
  sqft: number;
  floorTypePercentages: { hardfloor: number; carpet: number };
  rooms: ReviewRoom[];
  frequency: string;
  selectedPackage: string; // name that matches PACKAGE_DETAILS entries
};

interface ReviewStepProps {
  data: ReviewData;
}

export default function ReviewStep({ data }: ReviewStepProps) {
  const selectedPackage = PACKAGE_DETAILS.find(
    (pkg) => pkg.name === data.selectedPackage
  );

  const calculateEstimatedPrice = () => {
    if (!selectedPackage || !data.sqft || !data.frequency) return 0;

    const frequencyMultipliers: Record<string, number> = {
      'One Time': 2.5,
      Weekly: 1.0,
      '2 Days a Week': 1.8,
      '3 Days a Week': 2.5,
      '5 Days a Week': 3.8,
      Daily: 5.0,
    };

    const multiplier = frequencyMultipliers[data.frequency] ?? 1;
    const baseMonthlyPrice = data.sqft * selectedPackage?.packageCost * multiplier;

    // Round to nearest $50
    return Math.round(baseMonthlyPrice / 50) * 50;
  };

  const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="text-[#001F54] font-semibold">{value}</span>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#F5C542] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#001F54] mb-2">
          Review Your Quote Request
        </h3>
        <p className="text-gray-600">
          Please review all details before submitting your quote request
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-[#001F54] mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Contact Information
          </h4>
          <div className="space-y-0">
            <InfoRow label="Name" value={`${data.contact.firstName} ${data.contact.lastName}`} />
            <InfoRow label="Company" value={data.contact.company} />
            <InfoRow label="Email" value={data.contact.email} />
            <InfoRow label="Phone" value={data.contact.phone} />
            <InfoRow
              label="Address"
              value={`${data.contact.address}, ${data.contact.city}, ${data.contact.state} ${data.contact.postalCode}`}
            />
          </div>
        </div>

        {/* Facility Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-[#001F54] mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Facility Details
          </h4>
          <div className="space-y-0">
            <InfoRow label="Facility Type" value={data.facilityType} />
            <InfoRow label="Square Footage" value={`${data.sqft.toLocaleString()} sq ft`} />
            <InfoRow label="Floors" value={data.floors} />
            <InfoRow label="Carpeted Stairwells" value={data.stairwellsCarpeted || 'None'} />
            <InfoRow label="Hard Floor Stairwells" value={data.stairwellsHardfloor || 'None'} />
            <InfoRow label="Monthly Budget" value={`$${data.budget.toLocaleString()}`} />
          </div>
        </div>

        {/* Room Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-[#001F54] mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Room Breakdown ({data.rooms.reduce((sum, room) => sum + room.count, 0)} total)
          </h4>
          <div className="space-y-0 max-h-48 overflow-y-auto">
            {data.rooms.map((room, index) => (
              <InfoRow key={index} label={room.roomType} value={room.count} />
            ))}
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-[#001F54] mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Service Details
          </h4>
          <div className="space-y-0">
            <InfoRow label="Cleaning Frequency" value={data.frequency} />
            <InfoRow label="Selected Package" value={data.selectedPackage} />
          </div>

          {selectedPackage && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h5 className="font-medium text-gray-700 mb-2">Package Features:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {selectedPackage.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-3 h-3 text-[#F5C542] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="bg-gradient-to-r from-[#001F54] to-[#0a2d7a] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold mb-2">Estimated Monthly Investment</h4>
            <p className="text-blue-200 text-sm">
              {data.selectedPackage} package • {data.frequency} • {data.sqft.toLocaleString()} sq ft
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#F5C542] mb-1">
              ${calculateEstimatedPrice().toLocaleString()}
            </div>
            <div className="text-sm text-blue-200">
              {data.frequency === 'One Time' ? 'One-time service' : 'per month'}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-400">
          <p className="text-blue-100 text-sm">
            🌟 <strong>Final pricing will be customized</strong> based on your specific requirements,
            location factors, and any additional services discussed during our consultation.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 rounded-full bg-[#001F54] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-[#001F54] mb-2">Next Steps</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              After submitting your quote request, our team will review your requirements and contact you
              within 24 hours to schedule a facility walkthrough and provide a detailed, customized proposal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

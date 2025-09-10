'use client';

import { PackageType, PACKAGE_DETAILS, Frequency, ValidationErrors } from '../types';
import PackageCard from '../PackageCard';

interface PackageStepProps {
  selectedPackage: PackageType | '';
  onChange: (packageType: PackageType) => void;
  errors: ValidationErrors;
  sqft: number;
  frequency: Frequency | '';
}

export default function PackageStep({ 
  selectedPackage, 
  onChange, 
  errors, 
  sqft, 
  frequency 
}: PackageStepProps) {
  
  const calculateEstimatedPrice = (basePrice: number) => {
    if (!sqft || !frequency) return 0;
    
    const frequencyMultipliers: Record<Frequency, number> = {
      'One Time': 2.5, // Higher rate for one-time
      'Weekly': 1.0,
      '2 Days a Week': 1.8,
      '3 Days a Week': 2.5,
      '5 Days a Week': 3.8,
      'Daily': 5.0
    };
    
    const multiplier = frequencyMultipliers[frequency as Frequency] || 1;
    const baseMonthlyPrice = sqft * basePrice * multiplier;
    
    // Round to nearest 50
    return Math.round(baseMonthlyPrice / 50) * 50;
  };

  return (
    <div className="space-y-8">
      {errors.selectedPackage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-600 text-sm font-medium">{errors.selectedPackage}</p>
        </div>
      )}

      {/* Pricing Note */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 rounded-full bg-[#001F54] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-[#001F54] mb-2">Estimated Pricing</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Prices shown are estimates based on your facility size ({sqft?.toLocaleString()} sq ft) 
              and frequency ({frequency}). Final pricing will be customized based on your specific needs, 
              location, and any additional requirements discussed during consultation.
            </p>
          </div>
        </div>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {PACKAGE_DETAILS.map((pkg) => (
          <PackageCard
            key={pkg.name}
            package={pkg}
            isSelected={selectedPackage === pkg.name}
            onSelect={() => onChange(pkg.name)}
            estimatedPrice={calculateEstimatedPrice(pkg.basePrice)}
            frequency={frequency as string}
          />
        ))}
      </div>

      {/* Package Comparison */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#001F54] mb-4">
          Package Comparison
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-600 font-medium">Service</th>
                <th className="text-center py-2 text-gray-600 font-medium">Standard</th>
                <th className="text-center py-2 text-gray-600 font-medium">Pristine</th>
                <th className="text-center py-2 text-gray-600 font-medium">Elite</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-100">
                <td className="py-2">Trash removal & recycling</td>
                <td className="text-center py-2">✅</td>
                <td className="text-center py-2">✅</td>
                <td className="text-center py-2">✅</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">Vacuum carpets & rugs</td>
                <td className="text-center py-2">✅</td>
                <td className="text-center py-2">✅</td>
                <td className="text-center py-2">✅</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">Dust surfaces & furniture</td>
                <td className="text-center py-2">✅</td>
                <td className="text-center py-2">✅</td>
                <td className="text-center py-2">✅</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">Clean & sanitize restrooms</td>
                <td className="text-center py-2">✅</td>
                <td className="text-center py-2">✅</td>
                <td className="text-center py-2">✅</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">Deep carpet cleaning</td>
                <td className="text-center py-2">❌</td>
                <td className="text-center py-2">✅</td>
                <td className="text-center py-2">✅</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">Window cleaning</td>
                <td className="text-center py-2">❌</td>
                <td className="text-center py-2">✅</td>
                <td className="text-center py-2">✅</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">Floor mopping & care</td>
                <td className="text-center py-2">❌</td>
                <td className="text-center py-2">✅</td>
                <td className="text-center py-2">✅</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">High-touch disinfection</td>
                <td className="text-center py-2">❌</td>
                <td className="text-center py-2">❌</td>
                <td className="text-center py-2">✅</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">Supply restocking</td>
                <td className="text-center py-2">❌</td>
                <td className="text-center py-2">❌</td>
                <td className="text-center py-2">✅</td>
              </tr>
              <tr>
                <td className="py-2">Quality inspections</td>
                <td className="text-center py-2">❌</td>
                <td className="text-center py-2">❌</td>
                <td className="text-center py-2">✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
'use client';

import { PackageDetails } from './types';

interface PackageCardProps {
  package: PackageDetails;
  isSelected: boolean;
  onSelect: () => void;
  estimatedPrice: number;
  frequency: string;
}

export default function PackageCard({ 
  package: pkg, 
  isSelected, 
  onSelect, 
  estimatedPrice,
  frequency 
}: PackageCardProps) {
  const getPackageGradient = (name: string) => {
    switch (name) {
      case 'Standard':
        return 'from-blue-50 to-blue-100';
      case 'Pristine':
        return 'from-yellow-50 to-yellow-100';
      case 'Elite':
        return 'from-purple-50 to-purple-100';
      default:
        return 'from-gray-50 to-gray-100';
    }
  };

  const getPackageIcon = (name: string) => {
    switch (name) {
      case 'Standard':
        return '✨';
      case 'Pristine':
        return '🌟';
      case 'Elite':
        return '👑';
      default:
        return '🧹';
    }
  };

  const isPopular = pkg.name === 'Pristine';

  return (
    <div className="relative">
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-[#F5C542] text-[#001F54] text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            MOST POPULAR
          </span>
        </div>
      )}
      
      <button
        onClick={onSelect}
        className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 ${
          isSelected
            ? 'border-[#F5C542] ring-4 ring-[#F5C542]/20 shadow-xl scale-105'
            : 'border-gray-200 hover:border-[#F5C542]/50'
        } ${isPopular ? 'pt-8' : ''}`}
      >
        <div className={`bg-gradient-to-br ${getPackageGradient(pkg.name)} rounded-lg p-6 mb-4`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getPackageIcon(pkg.name)}</span>
              <h3 className="text-xl font-bold text-[#001F54]">
                {pkg.name}
              </h3>
            </div>
            
            {isSelected && (
              <div className="w-6 h-6 rounded-full bg-[#F5C542] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          <p className="text-gray-700 text-sm mb-4 leading-relaxed">
            {pkg.description}
          </p>
          
          <div className="mb-4">
            <div className="text-center py-3 bg-white rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-[#001F54] mb-1">
                ${estimatedPrice.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {frequency === 'One Time' ? 'One-time service' : 'per month'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                *Estimated pricing
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-[#001F54] mb-3">Included Services:</h4>
          {pkg.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <svg className="w-4 h-4 text-[#F5C542] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </button>
    </div>
  );
}
'use client';

import { Frequency, FREQUENCIES, ValidationErrors } from '../types';

interface FrequencyStepProps {
  frequency: Frequency | '';
  onChange: (frequency: Frequency) => void;
  errors: ValidationErrors;
}

export default function FrequencyStep({ frequency, onChange, errors }: FrequencyStepProps) {
  const frequencyDescriptions: Record<Frequency, { description: string; multiplier: number; recommended?: string }> = {
    'One Time': { 
      description: 'Perfect for move-ins, events, or deep cleaning projects',
      multiplier: 1,
      recommended: 'Special occasions'
    },
    'Weekly': { 
      description: 'Ideal for smaller offices and low-traffic facilities',
      multiplier: 4.33,
      recommended: 'Small offices'
    },
    '2 Days a Week': { 
      description: 'Good balance for medium-sized offices with moderate traffic',
      multiplier: 8.66,
      recommended: 'Medium offices'
    },
    '3 Days a Week': { 
      description: 'Suitable for busy offices and professional environments',
      multiplier: 13,
      recommended: 'Busy offices'
    },
    '5 Days a Week': { 
      description: 'Comprehensive care for high-traffic business facilities',
      multiplier: 21.67,
      recommended: 'High-traffic'
    },
    'Daily': { 
      description: 'Premium service for medical facilities and critical environments',
      multiplier: 30.4,
      recommended: 'Medical/Critical'
    }
  };

  const getFrequencyIcon = (freq: Frequency) => {
    const icons: Record<Frequency, string> = {
      'One Time': '⚡',
      'Weekly': '📅',
      '2 Days a Week': '📋',
      '3 Days a Week': '📊',
      '5 Days a Week': '🏢',
      'Daily': '🌟'
    };
    return icons[freq];
  };

  const getPopularBadge = (freq: Frequency) => {
    return ['3 Days a Week', '5 Days a Week'].includes(freq);
  };

  return (
    <div className="space-y-6">
      {errors.frequency && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-600 text-sm font-medium">{errors.frequency}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FREQUENCIES.map((freq) => {
          const details = frequencyDescriptions[freq];
          const isPopular = getPopularBadge(freq);
          
          return (
            <div key={freq} className="relative">
              {isPopular && (
                <div className="absolute -top-2 -right-2 z-10">
                  <span className="bg-[#F5C542] text-[#001F54] text-xs font-bold px-2 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}
              
              <button
                onClick={() => onChange(freq)}
                className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 hover:border-[#F5C542] hover:bg-yellow-50 hover:shadow-md transform hover:-translate-y-1 relative ${
                  frequency === freq
                    ? 'border-[#F5C542] bg-yellow-50 ring-2 ring-[#F5C542] shadow-lg'
                    : 'border-gray-200 bg-white'
                } ${isPopular ? 'border-[#F5C542]/30' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFrequencyIcon(freq)}</span>
                    <div>
                      <h3 className="font-semibold text-[#001F54] text-lg">
                        {freq}
                      </h3>
                      {details.recommended && (
                        <span className="text-xs font-medium text-[#F5C542] bg-[#F5C542]/10 px-2 py-1 rounded-full">
                          {details.recommended}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {frequency === freq && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-[#F5C542] flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {details.description}
                </p>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    {freq === 'One Time' ? 'Single service' : `~${details.multiplier} visits/month`}
                  </span>
                  {freq !== 'One Time' && (
                    <span className="font-semibold text-[#001F54]">
                      Monthly frequency
                    </span>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 rounded-full bg-[#001F54] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-[#001F54] mb-2">Choosing the Right Frequency</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              The cleaning frequency depends on your facility type, foot traffic, and business needs. 
              Most offices find 3-5 days per week provides the best balance of cleanliness and cost-effectiveness. 
              Medical and food service facilities typically require daily cleaning for health regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
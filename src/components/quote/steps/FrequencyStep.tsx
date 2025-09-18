'use client';

import type { ValidationErrors } from '@/types/quote-ui';
import {
  FREQUENCY_OPTIONS,
  getFrequencyDetails,
  isPopularFrequency,
} from '@/data/frequencyOptions';
import type { CleaningFrequency } from '@/types/packages';

interface FrequencyStepProps {
  frequency: CleaningFrequency;
  onChange: (frequency: CleaningFrequency) => void;
  errors: ValidationErrors;
}

function formatVisits(n: number | null): string {
  if (n === null) return 'Single service';
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

export default function FrequencyStep({ frequency, onChange, errors }: FrequencyStepProps) {
  return (
    <div className="space-y-6">
      {errors.frequency && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-600">{errors.frequency}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {FREQUENCY_OPTIONS.map((freq) => {
          const details = getFrequencyDetails(freq);
          const popular = isPopularFrequency(freq);

          return (
            <div key={freq} className="relative">
              {popular && (
                <div className="absolute -right-2 -top-2 z-10">
                  <span className="rounded-full bg-[#F5C542] px-2 py-1 text-xs font-bold text-[#001F54]">
                    POPULAR
                  </span>
                </div>
              )}

              <button
                type="button"
                aria-pressed={frequency === freq}
                onClick={() => onChange(freq)}
                className={`relative w-full rounded-xl border-2 p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#F5C542] hover:bg-yellow-50 hover:shadow-md ${
                  frequency === freq
                    ? 'border-[#F5C542] bg-yellow-50 ring-2 ring-[#F5C542] shadow-lg'
                    : 'border-gray-200 bg-white'
                } ${popular ? 'border-[#F5C542]/30' : ''}`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{details.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-[#001F54]">{freq}</h3>
                      {details.recommended && (
                        <span className="rounded-full bg-[#F5C542]/10 px-2 py-1 text-xs font-medium text-[#F5C542]">
                          {details.recommended}
                        </span>
                      )}
                    </div>
                  </div>

                  {frequency === freq && (
                    <div className="flex-shrink-0">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5C542]">
                        <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                <p className="mb-3 text-sm leading-relaxed text-gray-600">{details.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {details.multiplier === null
                      ? 'Single service'
                      : `~${formatVisits(details.multiplier)} visits/month`}
                  </span>
                  {details.multiplier !== null && (
                    <span className="font-semibold text-[#001F54]">Monthly frequency</span>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#001F54]">
            <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-[#001F54]">Choosing the Right Frequency</h4>
            <p className="text-sm leading-relaxed text-gray-700">
              The cleaning frequency depends on your facility type, foot traffic, and business needs.
              Most offices find 3–5 days per week provides the best balance of cleanliness and cost-effectiveness.
              Medical and food service facilities typically require daily cleaning for health regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

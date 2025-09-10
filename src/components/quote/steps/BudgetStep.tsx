'use client';

import { ValidationErrors } from '../types';

interface BudgetStepProps {
  budget: number;
  onChange: (budget: number) => void;
  errors: ValidationErrors;
}

export default function BudgetStep({ budget, onChange, errors }: BudgetStepProps) {
  const handleBudgetChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange(numValue);
  };

  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="budget" className="block text-sm font-semibold text-gray-700 mb-2">
          Monthly Cleaning Budget *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
            $
          </span>
          <input
            id="budget"
            type="number"
            min="0"
            step="50"
            value={budget || ''}
            onChange={(e) => handleBudgetChange(e.target.value)}
            className={`w-full rounded-xl border pl-8 pr-4 py-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 text-lg ${
              errors.budget 
                ? 'border-red-500 ring-2 ring-red-500' 
                : 'border-gray-300 focus:ring-[#001F54] focus:border-[#001F54]'
            }`}
            placeholder="2500"
          />
        </div>
        {errors.budget && (
          <p className="text-red-600 text-sm mt-2">{errors.budget}</p>
        )}
        <p className="text-gray-600 text-sm mt-2">
          Enter your estimated monthly budget for cleaning services
        </p>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 rounded-full bg-[#001F54] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-[#001F54] mb-2">Pricing Factors</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Your final quote will be customized based on your facility size, cleaning frequency, 
              and specific service requirements. This budget helps us recommend the best package for your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import type { ValidationErrors } from '@/types/quote-ui';

interface FloorsStairsStepProps {
  floors: number;
  stairwellsCarpeted: number;
  stairwellsHardfloor: number;
  onChange: (data: { floors: number; stairwellsCarpeted: number; stairwellsHardfloor: number }) => void;
  errors: ValidationErrors;
}

export default function FloorsStairsStep({ 
  floors, 
  stairwellsCarpeted, 
  stairwellsHardfloor, 
  onChange, 
  errors 
}: FloorsStairsStepProps) {
  
  const updateFloors = (value: string) => {
    const numValue = parseInt(value) || 1;
    onChange({ floors: numValue, stairwellsCarpeted, stairwellsHardfloor });
  };

  const updateCarpetedStairs = (value: string) => {
    const numValue = parseInt(value) || 0;
    onChange({ floors, stairwellsCarpeted: numValue, stairwellsHardfloor });
  };

  const updateHardfloorStairs = (value: string) => {
    const numValue = parseInt(value) || 0;
    onChange({ floors, stairwellsCarpeted, stairwellsHardfloor: numValue });
  };

  return (
    <div className="space-y-8">
      {/* Floors Section */}
      <div>
        <label htmlFor="floors" className="block text-sm font-semibold text-gray-700 mb-4">
          Number of Floors *
        </label>
        
        {/* Custom Input Only */}
        <div className="max-w-xs">
          <input
            id="floors"
            type="number"
            min="1"
            max="50"
            value={floors || ''}
            onChange={(e) => updateFloors(e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.floors 
                ? 'border-red-500 ring-2 ring-red-500' 
                : 'border-gray-300 focus:ring-[#001F54] focus:border-[#001F54]'
            }`}
            placeholder="Enter number of floors"
          />
          {errors.floors && (
            <p className="text-red-600 text-sm mt-2">{errors.floors}</p>
          )}
        </div>
      </div>

      {/* Stairwells Section */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-lg font-semibold text-[#001F54] mb-4">
          Stairwells
        </h3>
        <p className="text-gray-600 text-sm mb-6">
          Please specify the number of stairwells by flooring type (leave blank if none)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="carpetedStairs" className="block text-sm font-semibold text-gray-700 mb-2">
              Carpeted Stairwells
            </label>
            <input
              id="carpetedStairs"
              type="number"
              min="0"
              max="20"
              value={stairwellsCarpeted || ''}
              onChange={(e) => updateCarpetedStairs(e.target.value)}
              className={`w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.stairwellsCarpeted 
                  ? 'border-red-500 ring-2 ring-red-500' 
                  : 'border-gray-300 focus:ring-[#001F54] focus:border-[#001F54]'
              }`}
              placeholder="0"
            />
            {errors.stairwellsCarpeted && (
              <p className="text-red-600 text-sm mt-2">{errors.stairwellsCarpeted}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">Requires vacuuming and deep cleaning</p>
          </div>

          <div>
            <label htmlFor="hardfloorStairs" className="block text-sm font-semibold text-gray-700 mb-2">
              Hard Floor Stairwells
            </label>
            <input
              id="hardfloorStairs"
              type="number"
              min="0"
              max="20"
              value={stairwellsHardfloor || ''}
              onChange={(e) => updateHardfloorStairs(e.target.value)}
              className={`w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.stairwellsHardfloor 
                  ? 'border-red-500 ring-2 ring-red-500' 
                  : 'border-gray-300 focus:ring-[#001F54] focus:border-[#001F54]'
              }`}
              placeholder="0"
            />
            {errors.stairwellsHardfloor && (
              <p className="text-red-600 text-sm mt-2">{errors.stairwellsHardfloor}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">Requires mopping and sanitizing</p>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      {floors > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl p-6 border border-gray-200">
          <h4 className="font-semibold text-[#001F54] mb-3">Facility Overview</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#001F54]">{floors}</div>
              <div className="text-gray-600">Floor{floors > 1 ? 's' : ''}</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#F5C542]">{stairwellsCarpeted || 0}</div>
              <div className="text-gray-600">Carpeted Stairs</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#F5C542]">{stairwellsHardfloor || 0}</div>
              <div className="text-gray-600">Hard Floor Stairs</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

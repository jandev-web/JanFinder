'use client';

import { FloorTypePercentages } from './types';

interface FloorTypeSliderProps {
  percentages: FloorTypePercentages;
  onChange: (percentages: FloorTypePercentages) => void;
}

export default function FloorTypeSlider({ percentages, onChange }: FloorTypeSliderProps) {
  const handleHardfloorChange = (value: number) => {
    const hardfloor = Math.max(0, Math.min(100, value));
    const carpet = 100 - hardfloor;
    onChange({ hardfloor, carpet });
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-[#001F54] text-lg">Floor Type Distribution</h4>
      
      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={percentages.hardfloor}
          onChange={(e) => handleHardfloorChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${percentages.carpet}%, #F59E0B ${percentages.carpet}%, #F59E0B 100%)`
          }}
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Percentage Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="font-medium text-purple-700">Carpet</span>
          </div>
          <div className="text-2xl font-bold text-purple-800">
            {percentages.carpet}%
          </div>
          <div className="text-sm text-purple-600">
            ~{Math.round((percentages.carpet / 100) * 1000)} sq ft
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span className="font-medium text-amber-700">Hard Floor</span>
          </div>
          <div className="text-2xl font-bold text-amber-800">
            {percentages.hardfloor}%
          </div>
          <div className="text-sm text-amber-600">
            ~{Math.round((percentages.hardfloor / 100) * 1000)} sq ft
          </div>
        </div>
      </div>

      {/* Manual Input Option */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carpet %
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={percentages.carpet}
            onChange={(e) => {
              const carpet = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
              const hardfloor = 100 - carpet;
              onChange({ hardfloor, carpet });
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#001F54] focus:border-[#001F54] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hard Floor %
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={percentages.hardfloor}
            onChange={(e) => handleHardfloorChange(parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#001F54] focus:border-[#001F54] focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <p className="text-blue-700 text-sm">
          💡 This helps us determine the appropriate cleaning methods and equipment needed for your facility.
        </p>
      </div>
    </div>
  );
}
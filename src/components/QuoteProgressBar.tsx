import React from 'react';

interface CustomProgressBarProps {
  stepNumber: number; // Current progress (0 to 100)
}

const CustomProgressBar: React.FC<CustomProgressBarProps> = ({ stepNumber }) => {
  const progress = stepNumber * 25
  return (
    <div className="relative w-full max-w-4xl pt-16 pb-8 mx-auto">
       <div className="text-center mb-4">
        <span className="text-lg font-bold text-gray-700">
          Step {stepNumber} of 4
        </span>
      </div>

      {/* Step Numbers */}
      <div className="flex justify-between text-sm font-medium mb-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="text-gray-700">
            Step {index + 1}
          </div>
        ))}
      </div>

      {/* Outer Bar Container */}
      <div className="relative h-6 w-full bg-gray-300 rounded-lg overflow-hidden">
        {/* Fading Gradient Bar */}
        <div
          className="absolute top-0 left-0 h-full animate-continuous-fade"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #FFD700, #1E90FF, #FFD700)',
            backgroundSize: '200% 100%',
          }}
        ></div>
      </div>
    </div>
  );
};

export default CustomProgressBar;

import React from 'react';

interface CustomProgressBarProps {
  stepNumber: number; // Current progress (1 to 7, depending on the number of steps)
  steps: any; // Array of step names, each with a `name` and `canClick` property
  onStepClick: (step: number) => void; // Function to handle clicking on a step
}

const CustomProgressBar: React.FC<CustomProgressBarProps> = ({ stepNumber, steps, onStepClick }) => {
  const progress = (stepNumber / steps.length) * 100;
  console.log(steps)
  return (
    <div className="relative w-full max-w-4xl pt-16 pb-8 mx-auto">
      <div className="text-center mb-4">
        <div className="flex justify-between">
          {steps.map((step: any, index: number) => (
            <div
              key={index}
              className={`cursor-pointer text-sm ${step.canClick ? 'text-[#001F54]' : 'text-gray-400'} ${index + 1 === stepNumber ? 'font-bold text-yellow-500' : ''}`}
              onClick={() => step.canClick && onStepClick(index + 1)} // Clickable only if canClick is true
              style={{ cursor: step.canClick ? 'pointer' : 'not-allowed' }} // Prevent click if canClick is false
            >
              {step.name}
            </div>
          ))}
        </div>
      </div>

      {/* Outer Bar Container */}
      <div className="relative h-6 w-full bg-gray-300 rounded-lg overflow-hidden">
        {/* Fading Gradient Bar */}
        <div
          className="absolute top-0 left-0 h-full"
          style={{
            width: `${progress}%`,
            background: '#FFD700',
            backgroundSize: '200% 100%',
          }}
        ></div>
      </div>
    </div>
  );
};

export default CustomProgressBar;

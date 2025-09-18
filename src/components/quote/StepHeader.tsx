'use client';

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onStepClick: (step: number) => void;
  completedSteps: boolean[];
}

export default function StepHeader({ currentStep, totalSteps, title, subtitle, onStepClick, completedSteps }: StepHeaderProps) {
  const progress = (currentStep / totalSteps) * 100;

  const stepNames = [
    'Contact',
    'Budget', 
    'Facility',
    'Layout',
    'Space',
    'Frequency',
    'Package',
    'Review'
  ];

  return (
    <div className="mb-8">
      {/* Step Navigation Buttons */}
      <div className="mb-6">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-4">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNum = index + 1;
            const isCompleted = completedSteps[index];
            const isCurrent = stepNum === currentStep;
          
            const isClickable = isCompleted || stepNum <= currentStep;
            
            return (
              <button
                key={stepNum}
                onClick={() => isClickable && onStepClick(stepNum)}
                disabled={!isClickable}
                className={`p-3 rounded-2xl text-xs font-semibold transition-all duration-300 shadow-sm border ${
                  isCurrent
                    ? 'bg-[#001F54] text-white ring-2 ring-[#F5C542] border-[#001F54] shadow-lg'
                    : isCompleted
                    ? 'bg-white text-[#001F54] border-[#F5C542] hover:shadow-md cursor-pointer ring-1 ring-[#F5C542]'
                    : isClickable
                    ? 'bg-white text-gray-700 border-gray-200 hover:border-[#001F54] hover:shadow-md cursor-pointer'
                    : 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
                }`}
              >
                <div className="text-sm font-bold mb-1">{stepNum}</div>
                <div className="text-xs">{stepNames[index]}</div>
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-[#001F54]">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-[#001F54] to-[#0a2d7a] h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Title and Subtitle */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#001F54] mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
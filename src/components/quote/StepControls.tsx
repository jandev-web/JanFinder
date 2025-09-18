'use client';

// StepControls props
interface StepControlsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isValid: boolean;
  isSubmitting?: boolean;
  isSaving?: boolean; // NEW optional
}


export default function StepControls({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isValid,
  isSubmitting = false,
  isSaving
}: StepControlsProps) {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className="flex justify-between items-center pt-8 border-t border-gray-200">
      {!isFirstStep ? (
        <button
          onClick={onBack}
          disabled={isFirstStep}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${isFirstStep
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
        >
          Back
        </button>
      ) : <div></div>}


      <div className="text-sm text-gray-500 font-medium">
        Step {currentStep} of {totalSteps}
      </div>

      {isLastStep ? (
        <button
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${!isValid || isSubmitting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#001F54] text-white hover:bg-[#0a2d7a] hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            'Confirm Quote'
          )}
        </button>
      ) : (

        <button
          onClick={onNext}
          disabled={!isValid || isSaving}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${!isValid || isSaving
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#001F54] text-white hover:bg-[#0a2d7a] hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
        >
          {isSaving ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Saving…</span>
            </div>
          ) : (
            'Continue'
          )}
        </button>

      )}
    </div>
  );
}
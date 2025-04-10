'use client';

import React from 'react';

interface AddFormSuccessProps {
  handleSubmitAction: () => Promise<void>;
}

const AddFormSuccess: React.FC<AddFormSuccessProps> = ({ handleSubmitAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-5">
      <svg className="mx-auto w-24 h-24" viewBox="0 0 100 100">
        {/* Animated circle ring */}
        <circle
          className="stroke-[#001F54] stroke-[5] [stroke-dasharray:282] [stroke-dashoffset:282] animate-[drawCircle_1s_forwards]"
          cx="50"
          cy="50"
          r="45"
          fill="none"
        />
        {/* Animated check mark with a delay */}
        <path
          className="stroke-[#001F54] stroke-[5] [stroke-dasharray:42] [stroke-dashoffset:42] opacity-0 animate-[drawCheck_0.5s_forwards] delay-[1000ms]"
          d="M35 50 L45 60 L65 40"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      {/* Success text with a delay */}
      <p className="mt-5 text-xl text-[#001F54] opacity-0 animate-[fadeIn_0.5s_forwards] delay-[1500ms]">
        Member Added!
      </p>
      <button
        onClick={handleSubmitAction}
        className="mt-4 py-2 px-4 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-colors"
      >
        Add Another Member
      </button>
    </div>
  );
};

export default AddFormSuccess;

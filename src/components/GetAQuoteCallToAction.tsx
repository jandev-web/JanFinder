'use client';

import React from 'react';

interface CallToActionProps {
  onClick?: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onClick }) => {
  return (
    <div className="rounded-lg bg-yellow-400 px-8 py-12 text-center shadow-lg">
      <h2 className="mb-4 text-3xl font-bold text-[#001F54]">Ready to Get Started?</h2>
      <p className="mb-6 text-lg font-medium text-[#001F54]">
        Join hundreds of satisfied customers who have found their perfect cleaning service through Bid2Clean.
      </p>
      <button
        type="button"
        onClick={onClick}
        className="rounded-lg bg-[#001F54] px-6 py-3 font-bold text-white transition duration-300 hover:bg-blue-900"
      >
        Start Your Quote Now
      </button>
    </div>
  );
};

export default CallToAction;

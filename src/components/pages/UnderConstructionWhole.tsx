// src/pages/under-construction.tsx

'use client';

import React from 'react';

const UnderConstruction: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        🚧 Under Construction 🚧
      </h1>
      <p className="text-lg text-center mb-8">
        We are building something amazing for you! Our website is currently under development and will be live soon.
      </p>
      <p className="text-sm italic mb-16">Stay tuned for updates!</p>
    </div>
  );
};

export default UnderConstruction;

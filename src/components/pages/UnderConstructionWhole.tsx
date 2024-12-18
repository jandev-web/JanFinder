// src/pages/under-construction.tsx

'use client';

import React from 'react';

const UnderConstruction: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-blue-900">
          🚧 Under Construction 🚧
        </h1>
        <p className="text-xl text-gray-700 mb-6 leading-relaxed">
          Welcome to <span className="font-bold text-blue-900">Jan<span className="text-yellow-500">Finder</span></span> — the first commercial cleaning quote bidding platform. 
          We&apos;re revolutionizing the way cleaning companies and customers connect. Whether you&apos;re a customer searching for quick, easy quotes 
          to hire a cleaning company, or a cleaning business looking for innovative tools to streamline operations, attract clients, 
          and build strong customer relationships, <span className="font-bold text-blue-900">Jan<span className="text-yellow-500">Finder</span></span> has you covered.
        </p>
        <p className="text-lg text-gray-600 italic mb-6">
          Our site is under development and will be launching soon. Stay tuned for the next big thing in the cleaning industry!
        </p>
        <p className="text-sm text-gray-500 italic">
          Thank you for your patience while we create something amazing for you.
        </p>
      </div>
    </div>
  );
};

export default UnderConstruction;

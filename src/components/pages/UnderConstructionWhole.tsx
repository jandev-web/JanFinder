'use client';

import React, { useState, useEffect, useRef } from 'react';

const UnderConstruction: React.FC = () => {
  const [isTwoLines, setIsTwoLines] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const checkLineBreak = () => {
      if (headingRef.current) {
        const heading = headingRef.current;
        setIsTwoLines(heading.scrollWidth > heading.clientWidth);
      }
    };

    // Check initially and on window resize
    checkLineBreak();
    window.addEventListener('resize', checkLineBreak);

    return () => {
      window.removeEventListener('resize', checkLineBreak);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#001F54] via-blue-900 to-blue-800 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-10 max-w-3xl w-full text-center">
        {isTwoLines ? (
          <div>
            <span className="text-5xl mb-2 block">🚧</span>
            <h1
              ref={headingRef}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 text-blue-900"
            >
              Under Construction
            </h1>
            <span className="text-5xl mt-2 block">🚧</span>
          </div>
        ) : (
          <h1
            ref={headingRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 text-blue-900 flex items-center justify-center"
          >
            🚧 <span className="mx-2">Under Construction</span> 🚧
          </h1>
        )}
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-6 leading-relaxed">
          Welcome to <span className="font-bold text-blue-900">Bid<span className="text-yellow-400">2</span>Clean</span> — the first commercial cleaning quote bidding platform. 
          We&apos;re revolutionizing the way cleaning companies and customers connect. Whether you&apos;re a customer searching for quick, easy quotes 
          to hire a cleaning company, or a cleaning business looking for innovative tools to streamline operations, attract clients, 
          and build strong customer relationships, <span className="font-bold text-blue-900">Bid<span className="text-yellow-400">2</span>Clean</span> has you covered.
        </p>
        <p className="text-base sm:text-lg lg:text-xl text-yellow-500 italic mb-6">
          Our site is under development and will be launching soon. Stay tuned for the next big thing in the cleaning industry!
        </p>
        <p className="text-base sm:text-lg lg:text-xl text-blue-800 italic mb-6">
          Any Questions? Send them to info@bid2clean.com
        </p>
        <p className="text-sm text-gray-500 italic">
          Thank you for your patience while we create something amazing for you.
        </p>
      </div>
    </div>
  );
};

export default UnderConstruction;

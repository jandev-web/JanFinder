import React, { useEffect, useState } from 'react';

const LoadingSpinner: React.FC = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots + 1) % 4); // Cycle through 0 to 3 dots
    }, 500); // Change dots every 500ms

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mb-4"></div>

      {/* Loading text with dots */}
      <p className="text-xl font-semibold text-gray-700">
        Loading{'.'.repeat(dots)}{/* Correctly repeats the dots */}
      </p>
    </div>
  );
};

export default LoadingSpinner;

'use client';

const HowItWorks = () => (
  <div className="bg-white text-center w-full py-12 px-12 shadow-lg">
    <h2 className="text-4xl font-bold text-[#001F54] mb-6">How It Works</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition duration-300">
        <h3 className="text-2xl font-semibold text-yellow-500 mb-4">Step 1</h3>
        <p className="text-gray-700">
          Fill out a short form with just a few simple questions. It takes only seconds!
        </p>
      </div>
      <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition duration-300">
        <h3 className="text-2xl font-semibold text-yellow-500 mb-4">Step 2</h3>
        <p className="text-gray-700">
          Your request goes live for cleaning companies to bid on, ensuring the best competitive pricing.
        </p>
      </div>
      <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition duration-300">
        <h3 className="text-2xl font-semibold text-yellow-500 mb-4">Step 3</h3>
        <p className="text-gray-700">
          Receive your quote and a contract ready to sign in seconds!
        </p>
      </div>
    </div>
  </div>
);

export default HowItWorks;

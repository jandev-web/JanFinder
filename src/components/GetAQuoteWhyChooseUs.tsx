// @/components/WhyChooseUs.tsx
'use client';

const WhyChooseUs = () => (
  <div className="bg-[#001F54] text-white py-16 px-8 rounded-lg shadow-lg text-center">
    <h2 className="text-4xl font-bold mb-8">Why Choose Bid2Clean?</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-semibold mb-4">Competitive Pricing</h3>
        <p>
          We connect you with multiple cleaning companies, ensuring you get the best and most competitive prices available.
        </p>
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-4">Fast and Easy</h3>
        <p>
          Our form takes seconds to complete and only asks for the essentials, making your experience quick and hassle-free.
        </p>
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-4">Instant Feedback</h3>
        <p>
          Hear back from a cleaning company with a finalized quote and a ready-to-sign contract in seconds!
        </p>
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-4">Trusted Professionals</h3>
        <p>
          We only work with verified cleaning companies, ensuring quality and professionalism every step of the way.
        </p>
      </div>
    </div>
  </div>
);

export default WhyChooseUs;

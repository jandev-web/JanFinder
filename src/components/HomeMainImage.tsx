'use client';

import React, { useEffect, useState } from 'react';

const HomeMainImage: React.FC = () => {

    return (
        <section
  id="main-image-section"
  className="relative bg-cover bg-center bg-no-repeat w-full h-[700px] lg:h-[900px]"
  style={{ backgroundImage: "url('/images/firstHome.jpeg')" }}
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-50"></div>

  {/* Overlay Text */}
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
    {/* Main Title */}
    <h1 className="text-5xl lg:text-6xl font-bold pt-24 pb-4 text-yellow-400 drop-shadow-md">
      JanFinder
    </h1>
    <h2 className="text-3xl pb-4 text-yellow-400 drop-shadow-md">
      "Where Service providers pay for the privelege to service your facility, they bid you win!"
    </h2>

    {/* Catchy Description */}
    <p className="text-lg lg:text-2xl text-white pt-10 font-medium max-w-4xl pb-10 drop-shadow-lg">
      Your all-in-one platform for finding top-notch cleaning services and 
      managing your cleaning business with ease. JanFinder connects customers 
      with trusted cleaning companies, offering lightning-fast quotes and 
      competitive prices. Business owners, elevate your operations and secure 
      more jobs effortlessly. Getting a quote is easy, fast, and ensures the 
      best value—because cleaning up should never be complicated.
    </p>

    {/* Spacer */}
    <div className="h-60 pb-24"></div>

    {/* Mirrored Title */}
    <h1
      className="text-5xl lg:text-6xl font-bold mt-38 text-yellow-400 opacity-20 drop-shadow-md transform scale-y-[-1]"
      style={{ transform: 'scaleY(-1)' }}
    >
      JanFinder
    </h1>
  </div>
</section>

    );
};

export default HomeMainImage;

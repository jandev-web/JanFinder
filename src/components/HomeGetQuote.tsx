'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function GetQuoteHome() {
  return (
    <div className="relative pt-80 text-white shadow-xl">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/homePic.jpeg"
          alt="JanFinder"
          className="object-cover w-full h-full"
          fill={true}
          priority={true} /* Ensures the image is preloaded */
        />
      </div>
      
      {/* Content */}
      <div className="relative text-center pb-80 z-10">
        {/* New Image Section */}
        <div className="w-40 h-40 mx-auto mb-8 border-4 border-yellow-500 rounded-full overflow-hidden">
          <Image
            src="/images/janFighter.jpeg" /* Replace with your actual image path */
            alt="JanFinder Logo"
            className="object-cover w-full h-full"
            width={160}
            height={160}
          />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl font-extrabold mb-4 text-yellow-300 tracking-wide drop-shadow-lg">
          Welcome to JanFinder
        </h1>

        {/* Description */}
        <p className="text-lg mb-6">
          At JanFinder, we specialize in connecting you with the best cleaning services
          for your home and office. Our platform is designed to ensure that you find
          trustworthy, professional, and affordable cleaning solutions with ease.
        </p>
        <p className="text-lg mb-8">
          Whether you need a one-time deep clean or regular maintenance, JanFinder is
          here to help. Our network of cleaning experts is vetted, insured, and ready to
          provide top-notch services tailored to your needs.
        </p>

        {/* CTA Button */}
        <Link
          href="/customerInfo"
          className="get-quote-link bg-yellow-400 text-blue-800 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-yellow-500 hover:shadow-2xl transition duration-300 ease-in-out text-xl"
        >
          Get a quote today!
        </Link>
      </div>
    </div>
  );
}

export default GetQuoteHome;

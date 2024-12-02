'use client';

import React from 'react';
import Image from 'next/image';

const HomeJanPics: React.FC = () => {
    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-6">
                {/* Blurb Section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#001F54] mb-4">
                        The JanFinder Guarantee
                    </h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                        At JanFinder, we go the extra mile to ensure every cleaning company on our platform meets 
                        our rigorous standards of quality and professionalism. Our vetting process guarantees 
                        that you’ll always receive the best cleaning experience possible. If for any reason 
                        you’re not satisfied, we’ve got you covered with the JanFinder Guarantee: 
                        request a new cleaning service, completely free of charge, no questions asked, within one week.
                    </p>
                </div>

                {/* Images Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="flex justify-center">
                        <Image
                            src="/images/HomeJanPose1.jpeg"
                            alt="Friendly Janitor 1"
                            width={300}
                            height={600}
                            className="rounded-lg shadow-md hover:shadow-lg transition duration-300"
                        />
                    </div>
                    <div className="flex justify-center">
                        <Image
                            src="/images/HomeJanPose2.jpeg"
                            alt="Friendly Janitor 2"
                            width={300}
                            height={600}
                            className="rounded-lg shadow-md hover:shadow-lg transition duration-300"
                        />
                    </div>
                    <div className="flex justify-center">
                        <Image
                            src="/images/HomeJanPose3.jpeg"
                            alt="Friendly Janitor 3"
                            width={300}
                            height={600}
                            className="rounded-lg shadow-md hover:shadow-lg transition duration-300"
                        />
                    </div>
                    <div className="flex justify-center">
                        <Image
                            src="/images/HomeJanPose4.jpeg"
                            alt="Friendly Janitor 4"
                            width={300}
                            height={600}
                            className="rounded-lg shadow-md hover:shadow-lg transition duration-300"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeJanPics;

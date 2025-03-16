'use client';

import React from 'react';
import TopCustomerReviews from '@/components/TopCustomerReviews';
import TopOwnerReviews from '@/components/TopOwnerReviews';

const HomeReviews: React.FC = () => {
    return (
        <section
            className="bg-cover bg-center bg-no-repeat py-16"
            style={{ backgroundImage: "url('/images/homePic.jpeg')" }}
        >
            <div className="bg-black bg-opacity-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">
                        <span className="text-white">What People Are Saying About </span>
                        <span className="text-yellow-500">Bid2Clean</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Customer Reviews */}
                        <div>
                            <h3 className="text-2xl font-semibold text-blue-200 mb-6">
                                What <span className="text-yellow-500">Customers</span> Are Saying
                            </h3>
                            <TopCustomerReviews />
                        </div>

                        {/* Business Owner Reviews */}
                        <div>
                            <h3 className="text-2xl font-semibold text-yellow-500 mb-6">
                                What <span className="text-blue-200">Business Owners</span> Are Saying
                            </h3>
                            <TopOwnerReviews />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeReviews;

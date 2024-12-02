'use client';

import React from 'react';
import BusinessOwnerWhy from '@/components/BusinessOwnerWhy';
import BusinessOwnerTools from '@/components/BusinessOwnerTools';
import BusinessOwnerMoreJobs from '@/components/BusinessOwnerMoreJobs';
import BusinessOwnerStart from '@/components/BusinessOwnerStart';

const BusinessOwners: React.FC = () => {
    return (
        <main className="bg-gray-50">
            {/* Why Section */}
            <BusinessOwnerWhy />

            {/* Tools Section */}
            <BusinessOwnerTools />

            {/* More Jobs Section */}
            <BusinessOwnerMoreJobs />

            {/* Start Section */}
            <BusinessOwnerStart />
        </main>
    );
};

export default BusinessOwners;

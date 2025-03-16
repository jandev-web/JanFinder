'use client';

import React from 'react';
import IndustryPage from '@/components/Industry';

const OfficePage: React.FC = () => {
    return (
        <IndustryPage
            name="Offices"
            image="/images/offices.jpeg"
            blurb="Boost productivity and maintain a clean, professional workspace with Bid2Clean. Our network of trusted cleaning companies ensures your office remains a welcoming and hygienic environment for employees and clients alike."
        />
    );
};

export default OfficePage;

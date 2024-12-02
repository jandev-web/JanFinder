'use client';

import React from 'react';
import IndustryPage from '@/components/Industry';

const AirportPage: React.FC = () => {
    return (
        <IndustryPage
            name="Airports"
            image="/images/airport.jpeg"
            blurb="JanFinder specializes in connecting airports with top-tier cleaning companies. Whether it's maintaining cleanliness in terminals or ensuring a spotless experience for travelers, we make finding the right cleaning partner fast, easy, and reliable."
        />
    );
};

export default AirportPage;

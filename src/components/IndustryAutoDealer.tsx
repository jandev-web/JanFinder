'use client';

import React from 'react';
import IndustryPage from '@/components/Industry';

const AutoDealerPage: React.FC = () => {
    return (
        <IndustryPage
            name="Auto Dealers"
            image="/images/auto-dealer.jpeg"
            blurb="First impressions matter, especially when showcasing your vehicles. JanFinder connects auto dealerships with expert cleaning companies that specialize in keeping showrooms spotless and inviting. Let your customers focus on the cars, while we ensure your dealership shines."
        />
    );
};

export default AutoDealerPage;

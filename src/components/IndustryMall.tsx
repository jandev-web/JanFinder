'use client';

import React from 'react';
import IndustryPage from '@/components/Industry';

const MallPage: React.FC = () => {
    return (
        <IndustryPage
            name="Mall"
            image="/images/mall.jpeg"
            blurb="Ensure your shopping mall remains a pristine destination for shoppers. From food courts to corridors, Bid2Clean connects you with top cleaning professionals who deliver immaculate results, keeping every corner spotless and inviting for customers."
        />
    );
};

export default MallPage;

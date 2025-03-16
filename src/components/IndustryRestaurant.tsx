'use client';

import React from 'react';
import IndustryPage from '@/components/Industry';

const RestaurantPage: React.FC = () => {
    return (
        <IndustryPage
            name="Restaurant"
            image="/images/restaurant.jpeg"
            blurb="Create a spotless dining experience with Bid2Clean. From kitchens to dining areas, find expert cleaning services to ensure your restaurant meets the highest hygiene and cleanliness standards for your guests."
        />
    );
};

export default RestaurantPage;

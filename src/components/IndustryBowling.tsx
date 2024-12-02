'use client';

import React from 'react';
import IndustryPage from '@/components/Industry';

const BowlingAlleyPage: React.FC = () => {
    return (
        <IndustryPage
            name="Bowling Alleys"
            image="/images/bowling-alley.jpeg"
            blurb="A clean and polished bowling alley creates a striking first impression and keeps your guests coming back for more. JanFinder helps you connect with professional cleaning services that ensure your alleys, lanes, and facilities are spotless and ready for fun every day."
        />
    );
};

export default BowlingAlleyPage;
